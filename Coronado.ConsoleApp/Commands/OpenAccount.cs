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
    public class OpenAccount : ICommand
    {
        public bool Matches(string entry) {
            return Regex.Match(entry, "^ga\\d{1,2}$").Success;
        }

        public async Task Execute(Datastore context, params string[] args)
        {
            if (args.Length != 1)
            {
                throw new ArgumentException("OpenAccount command takes one argument");
            }
            var command = args[0];
            var accountDisplay = int.Parse(command.Substring(2));
            context.SelectedAccount = context.Accounts.FirstOrDefault(a => !a.IsHidden && a.DisplayOrder == accountDisplay - 1);
            if (context.SelectedAccount == null) return;
            using var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(CoronadoOptions.Url + "transactions/?accountId=" + context.SelectedAccount.AccountId)
            };
            request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
            var response = client.SendAsync(request).GetAwaiter().GetResult();
            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var model = JsonConvert.DeserializeObject<TransactionModel>(json);
            var i = 1;
            var transactionsToShow = model.Transactions.Take(10);
            var formatter = new TransactionFormatter(transactionsToShow);
            foreach (var trx in model.Transactions.Take(10))
            {
                trx.Alias = "t" + i++;
                Console.WriteLine(formatter.Format(trx));
            }
        }
    }
}
