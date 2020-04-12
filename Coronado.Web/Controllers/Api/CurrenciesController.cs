using System;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesController : ControllerBase
    {
        CoronadoDbContext _context;
        public CurrenciesController(CoronadoDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<decimal> GetExchangeRateFor(string symbol)
        {
            var currency = await _context.Currencies.FindBySymbol(symbol).ConfigureAwait(false);
            var isNew = false;
            if (currency == null) {
                currency = new Currency{
                    Symbol = symbol,
                    LastRetrieved = DateTime.MinValue
                };
                isNew = true;
            }
            if (isNew || currency.LastRetrieved < DateTime.Today) {
                using (var client = new HttpClient()) {
                    client.BaseAddress = new Uri("https://api.exchangeratesapi.io");
                    try {
                        var response = await client.GetAsync($"/latest?base=USD&symbols={symbol}");
                        response.EnsureSuccessStatusCode();
                        var stringResult = await response.Content.ReadAsStringAsync();
                        dynamic rawRate = JsonConvert.DeserializeObject(stringResult);
                        currency.PriceInUsd = rawRate.rates[symbol];
                        currency.LastRetrieved = DateTime.Today;
                        if ( isNew )
                            _context.Currencies.Add(currency);
                        // Don't do anything if updating an existing currency; EF will handle the
                        // change tracking for us
                        await _context.SaveChangesAsync().ConfigureAwait(false);
                    } catch(Exception e) {
                        // For now, do nothing
                        Console.WriteLine(e.Message);
                    }
                }
            }
            return currency.PriceInUsd;
        }
    }

}