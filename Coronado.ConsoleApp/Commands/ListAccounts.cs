using System;
using System.Linq;
using System.Threading.Tasks;

namespace Coronado.ConsoleApp.Commands
{
    public class ListAccounts
    {

        public Task Execute(Datastore context)
        {
            var accounts = context.Accounts
                .Where(a => !a.IsHidden)
                .OrderBy(a => a.DisplayOrder);
            foreach (var item in accounts)
            {
                item.Alias = $"a{item.DisplayOrder + 1}";
                Console.WriteLine(item);
            }
            return Task.CompletedTask;
        }
    }
}
