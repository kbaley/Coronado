using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesController : ControllerBase
    {
        readonly CoronadoDbContext _context;
        public CurrenciesController(CoronadoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<decimal> GetExchangeRateFor(string symbol)
        {
            var currency = _context.Currencies
                .OrderByDescending(c => c.LastRetrieved)
                .FirstOrDefault(c => c.Symbol == symbol);
            if (currency == null || currency.LastRetrieved < DateTime.Today) {
                using var client = new HttpClient
                {
                    BaseAddress = new Uri("https://api.exchangerate.host")
                };
                try
                {
                    var response = await client.GetAsync($"/latest?base=USD&symbols={symbol}");
                    response.EnsureSuccessStatusCode();
                    var stringResult = await response.Content.ReadAsStringAsync();
                    dynamic rawRate = JsonConvert.DeserializeObject(stringResult);
                    currency = new Currency {
                        CurrencyId = Guid.NewGuid(),
                        Symbol = symbol,
                        PriceInUsd = rawRate.rates[symbol],
                        LastRetrieved = DateTime.Today
                    };
                    _context.Currencies.Add(currency);
                    await _context.SaveChangesAsync().ConfigureAwait(false);
                }
                catch (Exception e)
                {
                    // For now, do nothing
                    Console.WriteLine(e.Message);
                }
            }
            return currency.PriceInUsd;
        }
    }

}
