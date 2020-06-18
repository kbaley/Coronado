using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp.Commands
{
    public class OpenAccount {
        public async Task Execute(Datastore context, string command) {
            var accountDisplay = int.Parse(command.Substring(2));
            context.SelectedAccount = context.Accounts.SingleOrDefault(a => a.DisplayOrder == accountDisplay - 1);
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
            foreach (var trx in model.Transactions.Take(10))
            {
                trx.Alias = "t" + i++;
                Console.WriteLine(trx);
            }
        }
    }
}
