﻿using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Coronado.Web.Models;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Authorization;
using System.Net;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

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
        private readonly ILogger<InvestmentsController> _logger;

        public InvestmentsController(ApplicationDbContext context, IInvestmentRepository investmentRepo,
            ICurrencyRepository currencyRepo, IAccountRepository accountRepo, ITransactionRepository transactionRepo,
            ICategoryRepository categoryRepo, ILogger<InvestmentsController> logger)
        {
            _investmentRepo = investmentRepo;
            _currencyRepo = currencyRepo;
            _accountRepo = accountRepo;
            _transactionRepo = transactionRepo;
            _categoryRepo = categoryRepo;
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Investment> GetInvestments()
        {
            var investments = _investmentRepo.GetAll();
            foreach (var investment in investments)
            {
                // if (investment.CanLookUp())
                // {
                    // UpdatePriceHistory(investment);
                // }
            }

            return investments.OrderBy(i => i.Name);
        }

        private void UpdatePriceHistory(Investment investment)
        {

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2");
                try
                {
                    var symbol = investment.Symbol;
                    var frequency = "1d";
                    var end = (DateTime.UtcNow - DateTime.UnixEpoch).TotalSeconds;
                    var lastPrice = investment.HistoricalPrices.OrderByDescending(d => d.Date).FirstOrDefault();
                    // Get three months worth of prices by default
                    var start = (DateTime.Today.AddMonths(-3).ToUniversalTime() - DateTime.UnixEpoch).TotalSeconds;
                    if (lastPrice != null) {
                        var startDate = lastPrice.Date;
                        // Don't go back more than 90 days
                        if ((DateTime.UtcNow - startDate).TotalDays >= 90) {
                            startDate = DateTime.UtcNow.AddDays(-90);
                        }
                        start = (startDate - DateTime.UnixEpoch).TotalSeconds;
                    }
                    var request = $"/get-historical-data?frequency={frequency}&filter=history&period1={start}&period2={end}&symbol={symbol}";
                    // var response = await client.GetAsync(request);
                    // response.EnsureSuccessStatusCode();
                    // var stringResult = await response.Content.ReadAsStringAsync();
                    var stringResult = System.IO.File.ReadAllText(@"moo.json");
                    dynamic rawResult = JsonConvert.DeserializeObject(stringResult);
                    var firstPrice = rawResult.prices[0];
                    var dateValue = firstPrice.date;
                    var date = DateTimeOffset.FromUnixTimeSeconds(dateValue).ToUniversalTime();
                    var price = firstPrice.close;
                    var prices = investment.HistoricalPrices.ToList();
                    prices.Add(new InvestmentPrice{ 
                        InvestmentPriceId = Guid.NewGuid(),
                        Price = price,
                        Date = date
                    });
                    // _investmentRepo.Update(investment);
                }
                catch
                {
                    // For now, do nothing
                }
            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult MakeCorrectingEntries()
        {

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