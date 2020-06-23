using System;
using System.Linq;
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
            ReadLine.AutoCompletionHandler = new VendorCompletionHandler(context);
            if (!GetInput("Vendor", out var vendor)) {
                ReadLine.AutoCompletionHandler = null;
                return;
            };
            ReadLine.AutoCompletionHandler = new CategoryCompletionHandler(context);
            if (!GetInput("Category", out var category)) {
                ReadLine.AutoCompletionHandler = null;
                return;
            };
            ReadLine.AutoCompletionHandler = null;
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
        }

        private bool GetInput(string prompt, out string entry) {
            entry = ReadLine.Read(prompt + ": ");
            if (entry == "xx") return false;
            return true;
        }

        public bool Matches(string entry)
        {
            return entry.Equals("nt", StringComparison.InvariantCultureIgnoreCase)
                || entry.Equals("new-transaction", StringComparison.InvariantCultureIgnoreCase);
        }
    }
    class VendorCompletionHandler : IAutoCompleteHandler
    {
        private readonly Datastore _context;
        public VendorCompletionHandler(Datastore context) : base() {
            _context = context;
        }
        public char[] Separators { get; set; } = new char[] { '\t' };

        public string[] GetSuggestions(string text, int index)
        {
            var vendors = _context.Vendors.Where(c => c.Name.Contains(text));
            if (vendors.Any()) return vendors.Select(c => c.Name).ToArray();
            return null;
        }
    }

    class CategoryCompletionHandler : IAutoCompleteHandler
    {
        private readonly Datastore _context;

        public CategoryCompletionHandler(Datastore context) : base() {
            _context = context;
        }

        public char[] Separators { get; set; } = new char[] { '\t' };
        public string[] GetSuggestions(string text, int index)
        {
            var categories = _context.Categories.Where(c => c.Name.Contains(text));
            if (categories.Any()) return categories.Select(c => c.Name).ToArray();
            return null;
        }
    }
}
