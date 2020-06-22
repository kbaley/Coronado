using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain.Formatters;

namespace Coronado.ConsoleApp.Commands
{
    public class ListAccounts : ICommand
    {
        public bool Matches(string entry) {
            return entry.Equals("la", StringComparison.InvariantCultureIgnoreCase)
                || entry.Equals("list-accounts", StringComparison.InvariantCultureIgnoreCase);
        }

        public Task Execute(Datastore context, params string[] _)
        {
            var accounts = context.Accounts
                .Where(a => !a.IsHidden)
                .OrderBy(a => a.DisplayOrder);
            var formatter = new AccountFormatter(accounts);
            foreach (var item in accounts)
            {
                item.Alias = $"a{item.DisplayOrder + 1}";
                Console.WriteLine(formatter.Format(item));
            }
            return Task.CompletedTask;
        }
    }
}
