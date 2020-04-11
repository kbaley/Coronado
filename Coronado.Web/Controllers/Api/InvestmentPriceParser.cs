using System;
using System.Linq;
using System.Net.Http;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Newtonsoft.Json;

namespace Coronado.Web.Controllers.Api
{
    public interface IInvestmentRetriever
    {
        string RetrieveDataFor(string symbol, double start);
    }

    public class InvestmentRetriever : IInvestmentRetriever
    {
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
    public class InvestmentPriceParser
    {
        private readonly IInvestmentRepository investmentRepo;
        private readonly IInvestmentRetriever investmentRetriever;

        public InvestmentPriceParser(IInvestmentRepository investmentRepository, IInvestmentRetriever investmentRetriever)
        {
            this.investmentRepo = investmentRepository;
            this.investmentRetriever = investmentRetriever;
        }

        public void UpdatePriceHistoryFor(Investment investment)
        {
            var lastPrice = investment.HistoricalPrices.OrderByDescending(d => d.Date).FirstOrDefault();
            // Get three months worth of prices by default
            var start = (DateTime.Today.AddMonths(-3).ToUniversalTime() - DateTime.UnixEpoch).TotalSeconds;
            if (lastPrice != null)
            {
                var startDate = lastPrice.Date;
                // Don't go back more than 90 days
                if ((DateTime.UtcNow - startDate).TotalDays >= 90)
                {
                    startDate = DateTime.UtcNow.AddDays(-90);
                }
                start = (startDate - DateTime.UnixEpoch).TotalSeconds;
            }
            var stringResult = investmentRetriever.RetrieveDataFor(investment.Symbol, start);
            dynamic rawResult = JsonConvert.DeserializeObject(stringResult);
            var firstPrice = rawResult.prices[0];
            var firstDate = firstPrice.date;
            var dateValue = (long)firstPrice.date;
            var date = DateTimeOffset.FromUnixTimeSeconds(dateValue).ToUniversalTime().Date;
            var price = (decimal)firstPrice.close;
            var prices = investment.HistoricalPrices.ToList();
            prices.Add(new InvestmentPrice
            {
                InvestmentPriceId = Guid.NewGuid(),
                Price = price,
                Date = date
            });
            investment.HistoricalPrices = prices;
            investmentRepo.Update(investment);
        }
    }
}