using System;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Coronado.ConsoleApp.Domain.Formatters;

namespace Coronado.ConsoleApp.Commands
{
    public class ListInvestments : ICommand
    {
        public bool Matches(string entry) {
            return entry.Equals("li", StringComparison.InvariantCultureIgnoreCase)
                || entry.Equals("list-investments", StringComparison.InvariantCultureIgnoreCase);
        }
        public async Task Execute(Datastore context, params string[] _)
        {
            var investments = context.Investments;
            var portfolioIrr = context.PortfolioIrr;
            if (investments == null)
            {
                var api = new CoronadoApi();
                var model = await api.Get<InvestmentModel>("investments").ConfigureAwait(false);
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
