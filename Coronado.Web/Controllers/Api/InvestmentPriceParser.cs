using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
            // Get symbols only for investments we have shares in
            var symbols = context.Investments
                .Include(i => i.Transactions)
                .Select(i => new {
                    i.Symbol,
                    Shares = i.Transactions.Sum(t => t.Shares)
                })
                .Where(s => s.Shares != 0)
                .Select(s => s.Symbol).ToList();
            var quoteData = await _investmentRetriever.RetrieveTodaysPricesFor(symbols).ConfigureAwait(false);
            var resultJson = JObject.Parse(quoteData).SelectToken("quoteResponse.result");
            var results = JsonConvert.DeserializeObject<List<MarketPrice>>(resultJson.ToString());
            foreach (var item in results)
            {
                var investment = investments.SingleOrDefault(i => i.Symbol == item.symbol);
                if (investment != null)
                {
                    investment.LastPriceRetrievalDate = DateTime.Today;
                    investment.LastPrice = item.regularMarketPrice;
                    context.Investments.Update(investment);
                }
            }
            await context.SaveChangesAsync().ConfigureAwait(false);
        }

    }

    public class MarketPrice {
        public decimal regularMarketPrice { get; set; }
        public string symbol { get; set; }
    }
}
