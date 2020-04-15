using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Newtonsoft.Json;

namespace Coronado.Web.Controllers.Api
{
    public class InvestmentPriceParser : IInvestmentPriceParser
    {
        private readonly IInvestmentRetriever _investmentRetriever;

        public InvestmentPriceParser(IInvestmentRetriever investmentRetriever)
        {
            _investmentRetriever = investmentRetriever;
        }

        async Task IInvestmentPriceParser.UpdatePricesFor(CoronadoDbContext context)
        {
            var investments = context.Investments.ToList();
            var symbols = investments.Select(i => i.Symbol);
            var quoteData = await _investmentRetriever.RetrieveTodaysPricesFor(symbols).ConfigureAwait(false);
            dynamic rawRate = JsonConvert.DeserializeObject(quoteData);
            var results = rawRate.quoteResponse.result;
            foreach (var item in results)
            {
                var symbol = item.symbol.Value;
                var investment = investments.SingleOrDefault(i => i.Symbol == symbol);
                if (investment != null)
                {
                    InvestmentPrice newPrice = null;
                    if (investment.HistoricalPrices != null)
                    {
                        var lastPrice = investment.HistoricalPrices.OrderByDescending(p => p.Date).FirstOrDefault();
                        if (lastPrice == null || lastPrice.Date < DateTime.Today)
                        {
                            newPrice = new InvestmentPrice();
                        }
                    }
                    else
                    {
                        newPrice = new InvestmentPrice();
                    }

                    if (newPrice != null)
                    {
                        newPrice.InvestmentPriceId = Guid.NewGuid();
                        newPrice.InvestmentId = investment.InvestmentId;
                        newPrice.Date = DateTime.Now;
                        newPrice.Price = (decimal)item.regularMarketPrice.Value;
                        context.InvestmentPrices.Add(newPrice);
                    }
                }
            }
            await context.SaveChangesAsync().ConfigureAwait(false);
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
            var stringResult = _investmentRetriever.RetrieveDataFor(investment.Symbol, start);
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
        }

    }
}
