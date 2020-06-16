using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using McMaster.Extensions.CommandLineUtils;

namespace Coronado.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            RunAsync(args).GetAwaiter().GetResult();
        }

        static async Task RunAsync(string[] args)
        {
            var url = "http://localhost:5000/";
            var app = new CommandLineApplication();
            app.Name = "Coronado";
            app.Description = "Console app for managing accounts and transactions with Coronado";

            app.HelpOption("-?|-h|--help");
            app.Command("accounts", (command) => {
                command.Description = "List accounts";
                command.HelpOption("-?|-h|--help");
                command.OnExecute(async () => {
                    var client = new HttpClient();
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json")
                    );
                    var response = await client.GetAsync("api/accounts" ).ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();
                });
            });
            app.Command("account", (command) => {
                command.Description = "Create a new account";
                command.HelpOption("-?|-h|--help");
                var name = command.Option("-n|--name", "Name of account", CommandOptionType.SingleValue);
                var startingBalance = command.Option("-b|--balance", "Starting balance", CommandOptionType.SingleValue);
                command.OnExecute(async () => {
                    if (!name.HasValue()) {
                        Console.WriteLine("Enter a name");
                        return;
                    }
                    var balance = startingBalance.HasValue() ? Convert.ToDecimal(startingBalance.Value()) : 0m;
                    var account = new Account {
                        AccountId = Guid.NewGuid(),
                        Name = name.Value(),
                        StartingBalance = balance
                    };
                    var client = new HttpClient();
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json")
                    );
                    var response = await client.PostAsJsonAsync("api/accounts", account );
                    response.EnsureSuccessStatusCode();

                    Console.WriteLine($"Account '{name.Value()}' created");
                });
            });
            app.Command("trx", (command) => {
                command.Description = "Add a transaction";
                command.HelpOption("-?|-h|--help");
                var account = command.Option("-a|--account", "Account name", CommandOptionType.SingleValue);
                var trxDate = command.Option("-d|--date", "Thing", CommandOptionType.SingleValue);
                var vendor = command.Option("-v|--vendor", "Vendor", CommandOptionType.SingleValue);
                var description = command.Option("-p|--description", "Description", CommandOptionType.SingleValue);
                var category = command.Option("-c|--category", "Transaction category", CommandOptionType.SingleValue);

                command.OnExecute(async () => {
                    var trx = new Transaction();
                    trx.TransactionId = Guid.NewGuid();
                    trx.AccountName = account.Value();
                    trx.TransactionDate = DateTime.Parse(trxDate.Value());
                    trx.Vendor = vendor.Value();
                    trx.Description = description.Value();
                    trx.CategoryName = category.Value();
                    var client = new HttpClient();
                    client.BaseAddress = new Uri(url);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(
                        new MediaTypeWithQualityHeaderValue("application/json")
                    );
                    var response = await client.PostAsJsonAsync("api/transactions", trx );
                    response.EnsureSuccessStatusCode();
                    Console.WriteLine("Transaction added");
                });
            });
            await Task.Run(() => app.Execute(args));
        }

        static void handleNewTransaction(string[] args)
        {

        }

        static void handleNewAccount(string[] args)
        {

        }
    }

    public class Transaction {
        public Guid TransactionId {get;set;}
        public DateTime TransactionDate { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public string AccountName { get; set; }
        public string CategoryName { get; set; }
    }

    class AutoCompletionHandler : IAutoCompleteHandler
    {
        public char[] Separators {get;set;} = new char[] { ' ' };
        public string[] GetSuggestions(string text, int index)
        {
            var suggestions = new string[] { "clone", "stash", "clothes", "closure" };
            if (index > 0) {
                var check = text.Substring(index);
                return suggestions.Where(s => s.StartsWith(check, StringComparison.CurrentCultureIgnoreCase)).ToArray();
            }
            return suggestions;
        }
    }
}
