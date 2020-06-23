using System;
using System.Linq;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Coronado.ConsoleApp.Domain.Formatters;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp.Commands
{
    public class ListTransactions : ICommand
    {
        public bool Matches(string entry) {
            return entry.Equals("lt", StringComparison.InvariantCultureIgnoreCase)
                || entry.Equals("list-transactions", StringComparison.InvariantCultureIgnoreCase);
        }

        public async Task Execute(Datastore context, params string[] args)
        {
            if (context.SelectedAccount == null)
            {
                Console.WriteLine("No account selected. List available accounts with 'la' or 'list-accounts', then select an account with 'ga<account alias>'");
                return;
            }
            var api = new CoronadoApi();
            var uri = $"transactions/?accountId={context.SelectedAccount.AccountId}";
            var model = await api.Get<TransactionModel>(uri).ConfigureAwait(false);
            var i = 1;
            var transactionsToShow = model.Transactions
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.EnteredDate)
                .Take(10);
            context.Transactions = model.Transactions;
            var formatter = new TransactionFormatter(transactionsToShow);
            foreach (var trx in model.Transactions.Take(10))
            {
                trx.Alias = "t" + i++;
                Console.WriteLine(formatter.Format(trx));
            }
        }
    }
}
