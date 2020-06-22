using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Coronado.ConsoleApp.Domain.Formatters;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp.Commands
{
    public class ListInvestments
    {
        public async Task Execute(Datastore context)
        {
            var investments = context.Investments;
            var portfolioIrr = context.PortfolioIrr;
            if (investments == null)
            {

                using var client = new HttpClient();
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(CoronadoOptions.Url + "investments")
                };
                request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
                var response = await client.SendAsync(request).ConfigureAwait(false);
                var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                var model = JsonConvert.DeserializeObject<InvestmentModel>(json);
                context.Investments = model.Investments;
                context.PortfolioIrr = model.PortfolioIrr;
                investments = context.Investments;
                portfolioIrr = context.PortfolioIrr;
            }
            var formatter = new InvestmentFormatter(investments);
            var i = 1;
            foreach (var item in investments)
            {
                item.DisplayOrder = i++;
                item.Alias = $"i{item.DisplayOrder}";
                Console.WriteLine(formatter.Format(item));
            }
            Console.WriteLine();
            Console.WriteLine($"Portfolio return: {portfolioIrr:P2}");
        }
    }
}
