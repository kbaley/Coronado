using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CurrenciesController : ControllerBase
    {
        private ICurrencyRepository _currencyRepo;

        public CurrenciesController(ICurrencyRepository currencyRepo)
        {
            _currencyRepo = currencyRepo;    
        }

        [HttpGet]
        public async Task<decimal> GetExchangeRateFor(string symbol)
        {
            var currency = _currencyRepo.Get(symbol);
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
                        _currencyRepo.Insert(currency);
                    else
                        _currencyRepo.Update(currency);
                    } catch {
                        // For now, do nothing
                    }
                }
            }
            return currency.PriceInUsd;
        }
    }

}