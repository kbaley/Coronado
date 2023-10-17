﻿using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Coronado.Web.Controllers.Dtos;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InvestmentsController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepo;
        private readonly IInvestmentPriceParser _priceParser;
        private readonly IMapper _mapper;
        private readonly CoronadoDbContext _context;

        public InvestmentsController(CoronadoDbContext context, ITransactionRepository transactionRepo,
            IInvestmentPriceParser priceParser, IMapper mapper)
        {
            _transactionRepo = transactionRepo;
            _priceParser = priceParser;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet("{investmentId}")]
        public async Task<ActionResult<InvestmentDetailDto>> Get(Guid investmentId)
        {
            var investment = await _context.Investments
                .Include(i => i.Dividends)
                .Include(i => i.Transactions)
                .ThenInclude(t => t.Transaction.Account)
                .SingleOrDefaultAsync(i => i.InvestmentId == investmentId).ConfigureAwait(false);
            if (investment == null)
            {
                return NotFound();
            }
            await _context.Entry(investment).Collection(i => i.Transactions).LoadAsync().ConfigureAwait(false);
            var dividendTransactions = _context.Transactions
                .Where(t => t.DividendInvestmentId == investmentId)
                .OrderBy(t => t.TransactionDate)
                .ThenBy(t => t.Amount)
                .ToList();
            var dividends = GetDividendDtosFrom(investment);
            var mappedInvestment = _mapper.Map<InvestmentDetailDto>(investment);
            mappedInvestment.Transactions = mappedInvestment.Transactions.OrderBy(t => t.Date);
            mappedInvestment.TotalPaid = Math.Round(investment.Transactions.Sum(t => t.Shares * t.Price), 2);
            mappedInvestment.CurrentValue = Math.Round(mappedInvestment.LastPrice * mappedInvestment.Shares);
            mappedInvestment.BookValue = Math.Round(mappedInvestment.AveragePrice * mappedInvestment.Shares);
            mappedInvestment.Dividends = dividends;

            return mappedInvestment;
        }

        private IEnumerable<InvestmentDividendDto> GetDividendDtosFrom(Investment investment) {

            var dividendTransactions = investment.Dividends
                .OrderBy(d => d.TransactionDate)
                .ThenBy(d => d.EnteredDate)
                .ThenBy(d => d.Amount)
                .ToList();
            var dividends = new List<InvestmentDividendDto>();
            var i = 0;

            // Some dividends have income tax; the sort order means we'll get all dividends
            // order by transaction date, then it will be pairs of transactions with the first one
            // being the tax (the amount is < 0) and the second being the actual dividend
            while (i < dividendTransactions.Count) {
                var dividend = new InvestmentDividendDto
                {
                    Date = dividendTransactions[i].TransactionDate,
                };
                if (dividendTransactions[i].Amount < 0) {
                    dividend.IncomeTax = -dividendTransactions[i++].Amount;
                }
                dividend.Amount = dividendTransactions[i++].Amount;
                dividend.Total = dividend.Amount - dividend.IncomeTax;

                dividends.Add(dividend);
            }

            return dividends;

        }

        [HttpGet]
        public InvestmentListModel GetInvestments()
        {
            var investments = _context.Investments
                .Include(i => i.Transactions)
                .Include(i => i.Dividends)
                .Select(i => new InvestmentForListDto
                {
                    InvestmentId = i.InvestmentId,
                    Name = i.Name,
                    Symbol = i.Symbol,
                    Shares = i.Transactions.Sum(t => t.Shares),
                    TotalSharesBought = i.Transactions.Where(t => t.Shares > 0).Sum(t => t.Shares),
                    LastPrice = i.LastPrice,
                    // Don't divide by number of shares yet in case it's zero; we'll do this later
                    AveragePrice = i.Transactions.Where(t => t.Shares > 0).Sum(t => t.Shares * t.Price),
                    Currency = i.Currency,
                    DontRetrievePrices = i.DontRetrievePrices,
                    AnnualizedIrr = i.GetAnnualizedIrr(),
                    CategoryId = i.CategoryId,
                    PaysDividends = i.PaysDividends
                })
                .Where(i => i.Shares != 0)
                .OrderBy(i => i.Name)
                .ToList();
            investments.ForEach(i =>
            {
                i.CurrentValue = i.Shares * i.LastPrice;
                i.AveragePrice = i.Shares == 0 ? 0 : i.AveragePrice / i.TotalSharesBought;
                i.BookValue = i.Shares * i.AveragePrice;
            });
            var totalIrr = _context.Investments.GetAnnualizedIrr();

            return new InvestmentListModel
            {
                Investments = investments,
                PortfolioIrr = totalIrr
            };
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<InvestmentListModel> SaveTodaysPrices(IEnumerable<TodaysPriceDto> investments)
        {
            var investmentsFromDb = _context.Investments.ToList();
            foreach (var item in investments)
            {
                var investment = investmentsFromDb.SingleOrDefault(i => i.InvestmentId == item.InvestmentId);
                if (investment != null)
                {
                    investment.LastPriceRetrievalDate = DateTime.Today;
                    investment.LastPrice = item.LastPrice;
                }
            }
            await _context.SaveChangesAsync().ConfigureAwait(false);
            return GetInvestments();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<InvestmentListModel> UpdateCurrentPrices()
        {
            var mustUpdatePrices = _context.Investments
                .Any(i => !i.DontRetrievePrices && i.LastPriceRetrievalDate < DateTime.Today);
            if (mustUpdatePrices)
            {
                await _priceParser.UpdatePricesFor(_context).ConfigureAwait(false);
            }
            if (mustUpdatePrices)
                return GetInvestments();
            return new InvestmentListModel
            {
                Investments = new List<InvestmentForListDto>(),
                PortfolioIrr = _context.Investments.GetAnnualizedIrr()
            };
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> RecordDividend(InvestmentDividendDto investmentDto)
        {

            var investment = await _context.Investments.FindAsync(investmentDto.InvestmentId);
            var investmentIncomeCategory = await _context.Categories
                .SingleAsync(c => c.Name == "Investment Income");
            var incomeTaxCategory = await _context.Categories
                .SingleAsync(c => c.Name == "Income Tax");
            var now = DateTime.Now;
            var exchangeRate = _context.Currencies.GetCadExchangeRate();
            var accountCurrency = (await _context.Accounts.FindAsync(investmentDto.AccountId)).Currency;
            var transaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),
                AccountId = investmentDto.AccountId,
                Amount = Math.Round(investmentDto.Amount, 2),
                TransactionDate = investmentDto.Date,
                EnteredDate = now,
                Description = investmentDto.Description + " (DIVIDEND)",
                TransactionType = TRANSACTION_TYPE.DIVIDEND,
                DividendInvestmentId = investmentDto.InvestmentId,
                CategoryId = investmentIncomeCategory.CategoryId,
            };
            transaction.SetAmountInBaseCurrency(accountCurrency, exchangeRate);
            _context.Transactions.Add(transaction);
            if (investmentDto.IncomeTax != 0)
            {
                var taxTransaction = new Transaction
                {
                    TransactionId = Guid.NewGuid(),
                    AccountId = investmentDto.AccountId,
                    Amount = -Math.Round(investmentDto.IncomeTax, 2),
                    TransactionDate = investmentDto.Date,
                    EnteredDate = now,
                    Description = investmentDto.Description + " (INCOME TAX)",
                    TransactionType = TRANSACTION_TYPE.DIVIDEND,
                    DividendInvestmentId = investmentDto.InvestmentId,
                    CategoryId = incomeTaxCategory.CategoryId,
                };
                taxTransaction.SetAmountInBaseCurrency(accountCurrency, exchangeRate);
                _context.Transactions.Add(taxTransaction);
            }
            await _context.SaveChangesAsync();

            return Ok(investment);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> BuySell(InvestmentForListDto investmentDto)
        {

            var investment = await _context.Investments.FindAsync(investmentDto.InvestmentId).ConfigureAwait(false);
            await CreateInvestmentTransaction(investmentDto, investment).ConfigureAwait(false);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Ok(investment);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> MakeCorrectingEntries()
        {
            var investments = _context.Investments
                .Include(i => i.Transactions);
            var currencyController = new CurrenciesController(_context);
            var currency = currencyController.GetExchangeRateFor("CAD").GetAwaiter().GetResult();
            var investmentsTotal = investments
                .Where(i => i.Currency == "CAD").ToList()
                .Sum(i => i.GetCurrentValue() / currency);
            investmentsTotal += investments
                .Where(i => i.Currency == "USD").ToList()
                .Sum(i => i.GetCurrentValue());
            var investmentAccount = _context.Accounts.FirstOrDefault(a => a.AccountType == "Investment");
            if (investmentAccount == null)
                return Ok();

            var bookBalance = _context.Transactions
                .Where(t => t.AccountId == investmentAccount.AccountId).ToList()
                .Sum(i => i.Amount);

            var difference = Math.Round(investmentsTotal - bookBalance, 2);
            if (Math.Abs(difference) >= 1)
            {
                var category = await _context.GetOrCreateCategory("Gain/loss on investments").ConfigureAwait(false);
                var transaction = new TransactionForDisplay
                {
                    TransactionId = Guid.NewGuid(),
                    AccountId = investmentAccount.AccountId,
                    Amount = difference,
                    CategoryId = category.CategoryId,
                    CategoryName = category.Name,
                    CategoryDisplay = category.Name,
                    TransactionDate = DateTime.Now,
                    EnteredDate = DateTime.Now,
                    Description = ""
                };
                transaction.SetDebitAndCredit();
                _transactionRepo.Insert(transaction);
                var accountBalances = _context.GetAccountBalances().ToList();
                var transactions = new[] { transaction };

                return CreatedAtAction("MakeCorrectingEntries", new { id = transaction.TransactionId }, new { transactions, accountBalances });
            }
            else
            {
                return Ok();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestment([FromRoute] Guid id, [FromBody] InvestmentForUpdateDto investment)
        {
            if (id != investment.InvestmentId)
            {
                return BadRequest();
            }
            // Don't update the price
            var investmentFromDb = await _context.Investments.FindAsync(investment.InvestmentId).ConfigureAwait(false);
            _context.Entry(investmentFromDb).State = EntityState.Detached;
            var lastPrice = investmentFromDb.LastPrice;
            var lastPriceRetrievalDate = investmentFromDb.LastPriceRetrievalDate;

            var investmentMapped = _mapper.Map<Investment>(investment);
            investmentMapped.LastPrice = lastPrice;
            investmentMapped.LastPriceRetrievalDate = lastPriceRetrievalDate;
            _context.Entry(investmentMapped).State = EntityState.Modified;
            if (investmentMapped.CategoryId == Guid.Empty)
            {
                investmentMapped.CategoryId = null;
            }
            await _context.SaveChangesAsync();
            await _context.Entry(investmentMapped).ReloadAsync().ConfigureAwait(false);
            await _context.Entry(investmentMapped).Collection(i => i.Transactions).LoadAsync().ConfigureAwait(false);
            var returnInvestment = _mapper.Map<InvestmentForListDto>(investmentMapped);

            return Ok(returnInvestment);
        }

        [HttpPost]
        public async Task<IActionResult> PostInvestment([FromBody] InvestmentForListDto investmentDto)
        {
            var investment = await _context.Investments.SingleOrDefaultAsync(i => i.Symbol == investmentDto.Symbol).ConfigureAwait(false);
            if (investment == null)
            {
                investmentDto.InvestmentId = Guid.NewGuid();
                var mappedInvestment = _mapper.Map<Investment>(investmentDto);
                investment = _context.Investments.Add(mappedInvestment).Entity;
            }
            var investmentTransaction = await CreateInvestmentTransaction(investmentDto, investment).ConfigureAwait(false);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            var accountBalances = _context.GetAccountBalances().ToList();
            return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId },
                new
                {
                    investment,
                    investmentTransaction,
                    accountBalances
                }
            );
        }

        private async Task<InvestmentTransaction> CreateInvestmentTransaction(InvestmentForListDto investmentDto, Investment investment)
        {
            var buySell = investmentDto.Shares > 0 ? $"Buy {investmentDto.Shares} share" : $"Sell {investmentDto.Shares} share";
            if (investmentDto.Shares != 1) buySell += "s";
            var description = $"Investment: {buySell} of {investmentDto.Symbol} at {investmentDto.LastPrice}";
            var investmentAccount = await _context.Accounts.FirstAsync(a => a.AccountType == "Investment").ConfigureAwait(false);
            var enteredDate = DateTime.Now;
            var exchangeRate = _context.Currencies.GetCadExchangeRate();
            var investmentAccountTransaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),
                AccountId = investmentAccount.AccountId,
                Amount = Math.Round(investmentDto.Shares * investmentDto.LastPrice, 2),
                TransactionDate = investmentDto.Date,
                EnteredDate = enteredDate,
                TransactionType = TRANSACTION_TYPE.INVESTMENT,
                Description = description
            };
            investmentAccountTransaction.SetAmountInBaseCurrency(investmentAccount.Currency, exchangeRate);
            var otherAccount = await _context.Accounts.FindAsync(investmentDto.AccountId);
            var currency = otherAccount.Currency;
            var transaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),
                AccountId = investmentDto.AccountId,
                Amount = 0 - Math.Round(investmentDto.Shares * investmentDto.LastPrice, 2),
                TransactionDate = investmentDto.Date,
                EnteredDate = enteredDate,
                TransactionType = TRANSACTION_TYPE.INVESTMENT,
                Description = description
            };
            transaction.SetAmountInBaseCurrency(currency, exchangeRate);
            var investmentTransaction = new InvestmentTransaction
            {
                InvestmentTransactionId = Guid.NewGuid(),
                InvestmentId = investment.InvestmentId,
                Shares = investmentDto.Shares,
                Price = investmentDto.LastPrice,
                Date = investmentDto.Date,
                TransactionId = transaction.TransactionId
            };
            _context.Transactions.Add(investmentAccountTransaction);
            _context.Transactions.Add(transaction);
            _context.InvestmentTransactions.Add(investmentTransaction);
            _context.Transfers.Add(new Transfer
            {
                TransferId = Guid.NewGuid(),
                LeftTransactionId = transaction.TransactionId,
                RightTransactionId = investmentAccountTransaction.TransactionId
            });
            _context.Transfers.Add(new Transfer
            {
                TransferId = Guid.NewGuid(),
                RightTransactionId = transaction.TransactionId,
                LeftTransactionId = investmentAccountTransaction.TransactionId
            });
            return investmentTransaction;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            var investment = _context.Investments
                .Include(i => i.Transactions)
                .ThenInclude(t => t.Transaction)
                .ThenInclude(t => t.LeftTransfer)
                .ThenInclude(t => t.RightTransaction)
                .ThenInclude(t => t.LeftTransfer)
                .Single(i => i.InvestmentId == id);
            foreach (var transaction in investment.Transactions)
            {
                _context.Transactions.Remove(transaction.Transaction.LeftTransfer.RightTransaction);
                _context.Transactions.Remove(transaction.Transaction);
                _context.Transfers.Remove(transaction.Transaction.LeftTransfer);
                _context.Transfers.Remove(transaction.Transaction.LeftTransfer.RightTransaction.LeftTransfer);
            }

            _context.Investments.Remove(investment);
            _context.SaveChanges();
            return Ok(investment);
        }
    }
}
