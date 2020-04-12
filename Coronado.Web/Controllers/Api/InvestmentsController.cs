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
        private readonly IInvestmentRepository _investmentRepo;
        private readonly ICurrencyRepository _currencyRepo;
        private readonly IAccountRepository _accountRepo;
        private readonly ITransactionRepository _transactionRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IInvestmentPriceRepository _investmentPriceRepo;
        private readonly ILogger<InvestmentsController> _logger;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public InvestmentsController(ApplicationDbContext context, IInvestmentRepository investmentRepo,
            ICurrencyRepository currencyRepo, IAccountRepository accountRepo, ITransactionRepository transactionRepo,
            ICategoryRepository categoryRepo, IInvestmentPriceRepository investmentPriceRepo,
            ILogger<InvestmentsController> logger, IMapper mapper)
        {
            _investmentRepo = investmentRepo;
            _currencyRepo = currencyRepo;
            _accountRepo = accountRepo;
            _transactionRepo = transactionRepo;
            _categoryRepo = categoryRepo;
            _investmentPriceRepo = investmentPriceRepo;
            _logger = logger;
            _mapper = mapper;
            _context = context;
        }

        [HttpGet]
        public IEnumerable<InvestmentForListDto> GetInvestments()
        {
            var investments = _investmentRepo.GetAll();
            foreach (var investment in investments)
            {
                // if (investment.CanLookUp())
                // {
                    // UpdatePrices(investment);
                // }
            }

            return investments.OrderBy(i => i.Name).Select(i => _mapper.Map<InvestmentForListDto>(i));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdatePriceHistory(InvestmentForListDto investment) {
            foreach(var priceDto in investment.HistoricalPrices) {
                if (priceDto.Status == "Deleted") {
                    _investmentPriceRepo.Delete(priceDto.InvestmentPriceId);
                } else if (priceDto.Status == "Added") {
                    priceDto.InvestmentPriceId = Guid.NewGuid();
                    var price = _mapper.Map<InvestmentPrice>(priceDto);
                    _investmentPriceRepo.Insert(price);
                }
            }
            var investmentFromDb = _investmentRepo.GetAll().Single(i => i.InvestmentId == investment.InvestmentId);
            return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId }, investmentFromDb);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult MakeCorrectingEntries()
        {
            var investments = GetInvestments();
            var currencyController = new CurrenciesController(_currencyRepo);
            var currency = currencyController.GetExchangeRateFor("CAD").GetAwaiter().GetResult();
            var investmentsTotal = investments
                .Where(i => i.Currency == "CAD")
                .Sum(i => i.AveragePrice * i.Shares / currency);
            investmentsTotal += investments
                .Where(i => i.Currency == "USD")
                .Sum(i => i.AveragePrice * i.Shares);
            var investmentAccount = _accountRepo.GetAll().FirstOrDefault(a => a.AccountType == "Investment");
            if (investmentAccount == null)
                return Ok();

            var bookBalance = _transactionRepo.GetByAccount(investmentAccount.AccountId).Sum(i => i.Amount);

            var difference = Math.Round(investmentsTotal - bookBalance, 2);
            if (Math.Abs(difference) >= 1)
            {
                var category = TransactionHelpers.GetOrCreateCategory("Gain/loss on investments", _categoryRepo);
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
                var accountBalances = _accountRepo.GetAccountBalances().Select(a => new { a.AccountId, a.CurrentBalance });
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
        public IActionResult PostInvestment([FromBody] Investment investment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (investment.InvestmentId == null || investment.InvestmentId == Guid.Empty) investment.InvestmentId = Guid.NewGuid();
            _investmentRepo.Insert(investment);

            return CreatedAtAction("PostInvestment", new { id = investment.InvestmentId }, investment);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var investment = _investmentRepo.Delete(id);
            if (investment == null)
            {
                return NotFound();
            }

            return Ok(investment);
        }
    }
}