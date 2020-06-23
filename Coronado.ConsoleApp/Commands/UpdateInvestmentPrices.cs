using System;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;

namespace Coronado.ConsoleApp.Commands
{
    public class UpdateInvestmentPrices : ICommand
    {
        public async Task Execute(Datastore context, params string[] args)
        {
            var api = new CoronadoApi();
            var model = await api.Post<InvestmentModel>("investments/UpdateCurrentPrices").ConfigureAwait(false);
            context.Investments = model.Investments;
            context.PortfolioIrr = model.PortfolioIrr;
            var listInvestments = new ListInvestments();
            await listInvestments.Execute(context).ConfigureAwait(false);
        }

        public bool Matches(string entry)
        {
            return entry.Equals("uip", StringComparison.InvariantCultureIgnoreCase)
                || entry.Equals("update-investment-prices", StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
