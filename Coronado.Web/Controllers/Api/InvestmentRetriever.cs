using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Coronado.Web.Controllers.Api
{
    public class InvestmentRetriever : IInvestmentRetriever
    {
        private readonly IConfiguration _config;

        public InvestmentRetriever(IConfiguration config)
        {
            _config = config;
        }
        public async Task<string> RetrieveTodaysPricesFor(IEnumerable<string> symbols)
        {

            using (var client = new HttpClient())
            {
                var region = "US";
                var lang = "en";
                var symbolList = string.Join(',', symbols);
                var end = (DateTime.UtcNow - DateTime.UnixEpoch).TotalSeconds;
                var requestUri = $"/get-quotes?region={region}&lang={lang}&symbols={symbolList}";
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market" + requestUri)
                };
                request.Headers.Add("x-rapidapi-host", "apidojo-yahoo-finance-v1.p.rapidapi.com");
                request.Headers.Add("x-rapidapi-key", _config.GetValue<string>("RapidApiKey"));
                var response = await client.SendAsync(request).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                var stringResult = await response.Content.ReadAsStringAsync();
                return stringResult;
            }
        }

        public string RetrieveDataFor(string symbol, double start)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2");
                var frequency = "1d";
                var end = (DateTime.UtcNow - DateTime.UnixEpoch).TotalSeconds;
                var request = $"/get-historical-data?frequency={frequency}&filter=history&period1={start}&period2={end}&symbol={symbol}";
                // var response = await client.GetAsync(request);
                // response.EnsureSuccessStatusCode();
                // var stringResult = await response.Content.ReadAsStringAsync();
                var stringResult = System.IO.File.ReadAllText(@"moo.json");
                return stringResult;
            }
        }
    }
}
