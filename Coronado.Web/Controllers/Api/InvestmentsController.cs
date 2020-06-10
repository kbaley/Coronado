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
        public async Task<ActionResult<InvestmentDetailDto>> Get(Guid investmentId) {
            var investment = await _context.Investments.FindAsync(investmentId).ConfigureAwait(false);
            if (investment == null) {
                return NotFound();
            }
            await _context.Entry(investment).Collection(i => i.Transactions).LoadAsync().ConfigureAwait(false);

            var mappedInvestment = _mapper.Map<InvestmentDetailDto>(investment);
            mappedInvestment.TotalPaid = Math.Round(investment.Transactions.Sum(t => t.Shares * t.Price), 2);
            mappedInvestment.CurrentValue = Math.Round(mappedInvestment.AveragePrice * mappedInvestment.Shares);

            return mappedInvestment;
        }

        [HttpGet]
        public IEnumerable<InvestmentForListDto> GetInvestments()
        {
            var investments = _context.Investments
                .Include(i => i.Transactions)
                .Select(i => new InvestmentForListDto{
                    InvestmentId = i.InvestmentId,
                    Name = i.Name,
                    Symbol = i.Symbol,
                    Shares = i.Transactions.Sum(t => t.Shares),
                    LastPrice = i.LastPrice,
                    AveragePrice = i.Transactions.Sum(t => t.Shares * t.Price) / i.Transactions.Sum(t => t.Shares),
                    Currency = i.Currency,
                    DontRetrievePrices = i.DontRetrievePrices,
                    AnnualizedIrr = i.GetAnnualizedIrr()
                })
                .OrderBy(i => i.Name)
                .ToList();
            investments.ForEach( i => {
                i.CurrentValue = i.Shares * i.LastPrice;
            });
            return investments;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<InvestmentForListDto>> SaveTodaysPrices(IEnumerable<TodaysPriceDto> investments)
        {
            var investmentsFromDb = _context.Investments.ToList();
            foreach (var item in investments)
            {
                var investment = investmentsFromDb.SingleOrDefault(i => i.InvestmentId == item.InvestmentId);
                if (investment != null) {
                    investment.LastPriceRetrievalDate = DateTime.Today;
                    investment.LastPrice = item.LastPrice;
                }
            }
            await _context.SaveChangesAsync().ConfigureAwait(false);
            return GetInvestments();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IEnumerable<InvestmentForListDto>> UpdateCurrentPrices()
        {
            var mustUpdatePrices = _context.Investments
                .Any(i => !i.DontRetrievePrices && i.LastPriceRetrievalDate < DateTime.Today);
            if (mustUpdatePrices)
            {
                await _priceParser.UpdatePricesFor(_context).ConfigureAwait(false);
            }
            if (mustUpdatePrices)
                return GetInvestments();
            return new List<InvestmentForListDto>();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> BuySell(InvestmentForListDto investmentDto) {

            var investment = await _context.Investments.FindAsync(investmentDto.InvestmentId).ConfigureAwait(false);
            await CreateInvestmentTransaction(investmentDto, investment).ConfigureAwait(false);
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Ok(investment);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdatePriceHistory(InvestmentForListDto investment)
        {
            // foreach (var priceDto in investment.HistoricalPrices)
            // {
            //     if (priceDto.Status == "Deleted")
            //     {
            //         await _context.InvestmentPrices.RemoveByIdAsync(priceDto.InvestmentPriceId).ConfigureAwait(false);
            //     }
            //     else if (priceDto.Status == "Added")
            //     {
            //         priceDto.InvestmentPriceId = Guid.NewGuid();
            //         var price = _mapper.Map<InvestmentPrice>(priceDto);
            //         await _context.InvestmentPrices.AddAsync(price).ConfigureAwait(false);
            //     }
            // }
            // await _context.SaveChangesAsync().ConfigureAwait(false);
            // var investmentFromDb = await _context.Investments.FindAsync(investment.InvestmentId);
            // await _context.Entry(investmentFromDb).Collection(i => i.HistoricalPrices).LoadAsync().ConfigureAwait(false);
            // investment = _mapper.Map<InvestmentForListDto>(investmentFromDb);
            // return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId }, investment);
            throw new NotImplementedException();
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
                var accountBalances = _context.Accounts.GetAccountBalances().ToList();
                var transactions = new[] { transaction };

                return CreatedAtAction("PostTransaction", new { id = transaction.TransactionId }, new { transactions, accountBalances });
            }
            else
            {
                return Ok();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestment([FromRoute] Guid id, [FromBody] InvestmentForUpdateDto investment)
        {
            if (id != investment.InvestmentId) {
                return BadRequest();
            }
            var investmentMapped = _mapper.Map<Investment>(investment);
            _context.Entry(investmentMapped).State = EntityState.Modified;
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

            var accountBalances = _context.Accounts.GetAccountBalances().ToList();
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
            var description = $"Investment: {buySell} of {investmentDto.Symbol} at {investmentDto.Price}";
            var investmentAccount = await _context.Accounts.FirstAsync(a => a.AccountType == "Investment").ConfigureAwait(false);
            var enteredDate = DateTime.Now;
            var investmentAccountTransaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),
                AccountId = investmentAccount.AccountId,
                Amount = Math.Round(investmentDto.Shares * investmentDto.Price, 2),
                TransactionDate = investmentDto.Date,
                EnteredDate = enteredDate,
                TransactionType = TRANSACTION_TYPE.INVESTMENT,
                Description = description
            };
            var transaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),
                AccountId = investmentDto.AccountId,
                Amount = 0 - Math.Round(investmentDto.Shares * investmentDto.Price, 2),
                TransactionDate = investmentDto.Date,
                EnteredDate = enteredDate,
                TransactionType = TRANSACTION_TYPE.INVESTMENT,
                Description = description
            };
            var investmentTransaction = new InvestmentTransaction
            {
                InvestmentTransactionId = Guid.NewGuid(),
                InvestmentId = investment.InvestmentId,
                Shares = investmentDto.Shares,
                Price = investmentDto.Price,
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
            if (investment == null)
            {
                return NotFound();
            }
            _context.Investments.Remove(investment);
            _context.SaveChanges();
            return Ok(investment);
        }
    }
}
