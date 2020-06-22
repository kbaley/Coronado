using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp.Commands
{
    public class NewTransaction : ICommand
    {
        public async Task Execute(Datastore context, params string[] args)
        {
            if (context.SelectedAccount == null) {
                Console.WriteLine("No account selected. List available accounts with 'la' or 'list-accounts', then select an account with 'ga<account alias>'");
                return;
            }
            if (!GetInput("Date", out var date)) return;
            if (!GetInput("Vendor", out var vendor)) return;
            if (!GetInput("Category", out var category)) return;
            if (!GetInput("Description", out var description)) return;
            if (!GetInput("Amount", out var amount)) return;

            var transaction = new Transaction {
                TransactionDate = DateTime.Parse(date),
                Vendor = vendor,
                CategoryName = category,
                Amount = decimal.Parse(amount),
                Description = description,
                AccountId = context.SelectedAccount.AccountId,
                TransactionType = "REGULAR",
            };
            if (transaction.Amount < 0) {
                transaction.Debit = -transaction.Amount;
            } else {
                transaction.Credit = transaction.Amount;
            }
            var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(CoronadoOptions.Url + "transactions")
            };
            request.Content = new StringContent(JsonConvert.SerializeObject(transaction),
                Encoding.UTF8, "application/json");
            request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
            var response = await client.SendAsync(request).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            System.Console.WriteLine(responseJson);
        }

        private bool GetInput(string prompt, out string entry) {
            Console.Write(prompt + ": ");
            entry = Console.ReadLine();
            if (entry == "xx") return false;
            return true;
        }

        public bool Matches(string entry)
        {
            return entry.Equals("nt", StringComparison.InvariantCultureIgnoreCase)
                || entry.Equals("new-transaction", StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
