using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Models;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;

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

        public InvestmentsController(ApplicationDbContext context, IInvestmentRepository investmentRepo,
            ICurrencyRepository currencyRepo, IAccountRepository accountRepo, ITransactionRepository transactionRepo,
            ICategoryRepository categoryRepo)
        {
            _investmentRepo = investmentRepo;
            _currencyRepo = currencyRepo;
            _accountRepo = accountRepo;
            _transactionRepo = transactionRepo;
            _categoryRepo = categoryRepo;
        }

        [HttpGet]
        public IEnumerable<Investment> GetInvestments()
        {
            var investments = _investmentRepo.GetAll();
            foreach (var investment in investments)
            {
                if (investment.LastRetrieved < DateTime.Today && !string.IsNullOrWhiteSpace(investment.Symbol)) {
                    var html = $"https://www.theglobeandmail.com/investing/markets/funds/{investment.Symbol}.CF/performance/";
                    var web = new HtmlWeb();
                    var htmlDoc = web.Load(html);
                    var node = htmlDoc.DocumentNode.SelectSingleNode("//barchart-field[@name='lastPrice']");
                    if (node != null && node.Attributes["value"] != null) {
                        investment.Price = decimal.Parse(node.Attributes["value"].Value);
                        investment.LastRetrieved = DateTime.Today;
                        _investmentRepo.Update(investment);
                    }
                }
            }

            return investments.OrderBy(i => i.Name);
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult MakeCorrectingEntries() {

            var investments = GetInvestments();
            var currencyController = new CurrenciesController(_currencyRepo);
            var currency = currencyController.GetExchangeRateFor("CAD").GetAwaiter().GetResult();
            var investmentsTotal = investments.Sum(i => i.Price * i.Shares);
            var totalInUsd = investmentsTotal / currency;
            var investmentAccount = _accountRepo.GetAll().FirstOrDefault(a => a.AccountType == "Investment");
            if (investmentAccount == null)
                return Ok();

            var bookBalance = _transactionRepo.GetByAccount(investmentAccount.AccountId).Sum(i => i.Amount);

            var difference = Math.Round(totalInUsd - bookBalance, 2);
            if (Math.Abs(difference) >= 1) {
                var category = TransactionHelpers.GetOrCreateCategory("Gain/loss on investments", _categoryRepo);
                var transaction = new TransactionForDisplay {
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

                return CreatedAtAction("PostTransaction", new { id = transaction.TransactionId }, new { transactions, accountBalances } );
            } else {
                return Ok();
            }
        }

        [HttpPut("{id}")]
        public IActionResult PutInvestment([FromRoute] Guid id, [FromBody] Investment investment)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != investment.InvestmentId)
            {
                return BadRequest();
            }

            _investmentRepo.Update(investment);

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