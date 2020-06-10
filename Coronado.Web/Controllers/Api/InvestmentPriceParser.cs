using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
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
                    investment.LastPriceRetrievalDate = DateTime.Today;
                    investment.LastPrice = (decimal)item.regularMarketPrice.Value;
                    context.Investments.Update(investment);
                }
            }
            await context.SaveChangesAsync().ConfigureAwait(false);
        }

    }
}
