using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;

namespace Coronado.ConsoleApp.Commands
{
    public class DeleteTransaction : ICommand
    {
        public async Task Execute(Datastore context, params string[] args)
        {
            if (args.Length != 1 || string.IsNullOrEmpty(args[0]))
            {
                Console.WriteLine("Please enter a transaction to delete");
                return;
            }

            var transactionAlias = args[0].Substring(1);
            var transaction = context.Transactions.SingleOrDefault(t => t.Alias == transactionAlias);
            if (transaction == null) {
                Console.WriteLine("Selected transaction not found");
                return;
            }
            var api = new CoronadoApi();
            await api.Delete<PostTransactionModel>("transactions", transaction.TransactionId);
            await new ListTransactions().Execute(context).ConfigureAwait(false);
        }

        public bool Matches(string entry)
        {
            return Regex.Match(entry, "^dt\\d{1,2}$").Success;
        }
    }
}
