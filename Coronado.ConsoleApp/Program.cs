using System;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using McMaster.Extensions.CommandLineUtils;

namespace Coronado.ConsoleApp
{
    class Program
    {
        static int Main(string[] args)
        {
            var app = new CommandLineApplication();
            app.Name = "Coronado";
            app.Description = "Console app for managing accounts and transactions with Coronado";

            app.HelpOption("-?|-h|--help");
            app.Command("account", (command) => {
                command.Description = "Create a new account";
                command.HelpOption("-?|-h|--help");
                var name = command.Option("-n|--name", "Name of account", CommandOptionType.SingleValue);
                var startingBalance = command.Option("-b|--balance", "Starting balance", CommandOptionType.SingleValue);
                command.OnExecute(() => {
                    if (!name.HasValue()) {
                        Console.WriteLine("Enter a name");
                        return;
                    }
                    var balance = startingBalance.HasValue() ? Convert.ToDouble(startingBalance.Value()) : 0.0;
                    Console.WriteLine($"NEw account: {balance}");
                });
            });
            var url = "http://localhost:5000/api/";
            return app.Execute(args);
        }

        static void handleNewTransaction(string[] args)
        {

        }

        static void handleNewAccount(string[] args)
        {

        }
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
