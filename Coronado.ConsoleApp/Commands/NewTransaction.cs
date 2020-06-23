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
            var api = new CoronadoApi();
            var model = await api.Post<PostTransactionModel>("transactions", transaction).ConfigureAwait(false);
            if (context.Vendors.All(v => v.VendorId != model.Vendor.VendorId)) {
                var vendors = context.Vendors.ToList();
                vendors.Add(model.Vendor);
                context.Vendors = vendors;
            }
            await new ListTransactions().Execute(context).ConfigureAwait(false);
            await Execute(context).ConfigureAwait(false);
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
