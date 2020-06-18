using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp.Commands
{
    public class ListAccounts
    {

        public async Task Execute(Datastore context)
        {
            var accounts = context.Accounts
                .Where(a => !a.IsHidden)
                .OrderBy(a => a.DisplayOrder);
            foreach (var item in accounts)
            {
                item.Alias = $"a{item.DisplayOrder + 1}";
                Console.WriteLine(item);
            }
        }
    }
}
