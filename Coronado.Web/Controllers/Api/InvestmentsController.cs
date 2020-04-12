using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
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
        private readonly IInvestmentPriceRepository _investmentPriceRepo;
        private readonly ILogger<InvestmentsController> _logger;
        private readonly IMapper _mapper;
        private readonly CoronadoDbContext _context;

        public InvestmentsController(CoronadoDbContext context,
            ICurrencyRepository currencyRepo, ITransactionRepository transactionRepo,
            ICategoryRepository categoryRepo, IInvestmentPriceRepository investmentPriceRepo,
            ILogger<InvestmentsController> logger, IMapper mapper)
        {
            _transactionRepo = transactionRepo;
            _investmentPriceRepo = investmentPriceRepo;
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public IEnumerable<InvestmentForListDto> GetInvestments()
        {
            var investments = _context.Investments
                .Include(i => i.HistoricalPrices)
                .OrderBy(i => i.Name)
                .ToList();
            var dtos = investments.Select(i => _mapper.Map<InvestmentForListDto>(i));
            return dtos;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdatePriceHistory(InvestmentForListDto investment) {
            foreach(var priceDto in investment.HistoricalPrices) {
                if (priceDto.Status == "Deleted") {
                    _investmentPriceRepo.Delete(priceDto.InvestmentPriceId);
                } else if (priceDto.Status == "Added") {
                    priceDto.InvestmentPriceId = Guid.NewGuid();
                    var price = _mapper.Map<InvestmentPrice>(priceDto);
                    _investmentPriceRepo.Insert(price);
                }
            }
            var investmentFromDb = await _context.Investments.FindAsync(investment.InvestmentId);
            return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId }, investmentFromDb);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> MakeCorrectingEntries()
        {
            var investments = GetInvestments();
            var currencyController = new CurrenciesController(_context);
            var currency = currencyController.GetExchangeRateFor("CAD").GetAwaiter().GetResult();
            var investmentsTotal = investments
                .Where(i => i.Currency == "CAD")
                .Sum(i => i.AveragePrice * i.Shares / currency);
            investmentsTotal += investments
                .Where(i => i.Currency == "USD")
                .Sum(i => i.AveragePrice * i.Shares);
            var investmentAccount = _context.Accounts.FirstOrDefault(a => a.AccountType == "Investment");
            if (investmentAccount == null)
                return Ok();

            var bookBalance = _context.Transactions
                .Where(t => t.AccountId == investmentAccount.AccountId)
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
                    Description = "Gain/loss"
                };
                transaction.SetDebitAndCredit();
                _transactionRepo.Insert(transaction);
                var accountBalances = _context.Accounts.GetAccountBalances().Select(a => new { a.AccountId, a.CurrentBalance} ).ToList();
                var transactions = new[] { transaction };

                return CreatedAtAction("PostTransaction", new { id = transaction.TransactionId }, new { transactions, accountBalances });
            }
            else
            {
                return Ok();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvestment([FromRoute] Guid id, [FromBody] InvestmentForListDto investment)
        {
            var investmentMapped = _mapper.Map<Investment>(investment);
            _context.Entry(investmentMapped).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(investment);
        }

        [HttpPost]
        public async Task<IActionResult> PostInvestment([FromBody] InvestmentForListDto investment)
        {
            if (investment.InvestmentId == null || investment.InvestmentId == Guid.Empty) investment.InvestmentId = Guid.NewGuid();
            var investmentMapped = _mapper.Map<Investment>(investment);
            _context.Investments.Add(investmentMapped);
            await _context.SaveChangesAsync();

            return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId }, investmentMapped);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var investment = await _context.Investments.FindAsync(id);
            if (investment == null) {
                return NotFound();
            }
            _context.Investments.Remove(investment);
            await _context.SaveChangesAsync();
            return Ok(investment);
        }
    }
}