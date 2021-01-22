using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Coronado.Web.Domain;
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace Coronado.Web.Controllers
{
    public class CurrencyController : Controller
    {

        private readonly IConfiguration _config;
        private readonly CoronadoDbContext _context;

        public CurrencyController(IConfiguration config, CoronadoDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> PopulateHistoricalCurrencies()
        {
            var earliestDate = _context.Transactions.OrderBy(t => t.TransactionDate).First().TransactionDate;
            earliestDate = new DateTime(earliestDate.Year, earliestDate.Month, 1).AddDays(-1);
            var currencies = _context.Currencies
                .Where(c => c.Symbol == "CAD")
                .ToList();
            var addedCurrencies = new List<Currency>();
            while (earliestDate <= DateTime.Today)
            {
                if (currencies.All(c => c.LastRetrieved != earliestDate))
                {
                    using var client = new HttpClient
                    {
                        BaseAddress = new Uri("https://api.exchangeratesapi.io")
                    };
                    try
                    {
                        var dateFormat = earliestDate.ToString("yyyy-MM-dd");
                        var response = await client.GetAsync($"/{dateFormat}?base=USD&symbols=CAD");
                        response.EnsureSuccessStatusCode();
                        var stringResult = await response.Content.ReadAsStringAsync();
                        dynamic rawRate = JsonConvert.DeserializeObject(stringResult);
                        var currency = new Currency
                        {
                            CurrencyId = Guid.NewGuid(),
                            Symbol = "CAD",
                            PriceInUsd = rawRate.rates["CAD"],
                            LastRetrieved = earliestDate
                        };
                        _context.Currencies.Add(currency);
                        addedCurrencies.Add(currency);
                    }
                    catch (Exception e)
                    {
                        // For now, do nothing
                        Console.WriteLine(e.Message);
                    }
                }
                earliestDate = earliestDate.AddMonths(1);

            }
            await _context.SaveChangesAsync().ConfigureAwait(false);
            return Ok(addedCurrencies);
        }
    }
}
