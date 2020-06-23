using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Commands;
using Coronado.ConsoleApp.Domain;
using Microsoft.Extensions.Configuration;
using static Coronado.ConsoleApp.Domain.Program;

namespace Coronado.ConsoleApp
{
    partial class Program
    {
        static Datastore context;
        static string settingsFile;
        static async Task Main(string[] args)
        {
            context = new Datastore();
            Initialize(args);
            var commands = GetCommands();
            await LoadLocalStore().ConfigureAwait(false);
            await DoTask(commands).ConfigureAwait(false);
        }

        static IEnumerable<ICommand> GetCommands() {
            var commands = new List<ICommand>
            {
                new ListAccounts(),
                new ListInvestments(),
                new OpenAccount(),
                new NewTransaction(),
            };

            return commands;
        }


        static async Task LoadLocalStore()
        {
            var api = new CoronadoApi();
            context.Accounts = await api.GetList<Account>().ConfigureAwait(false);
            context.Vendors = await api.GetList<Vendor>().ConfigureAwait(false);
        }

        static void Initialize(string[] args)
        {

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .AddCommandLine(args)
                .AddUserSecrets<Program>(false)
                .Build();

            CoronadoOptions.Bind(config.GetSection(CoronadoOptions.Coronado));

            Console.WriteLine($"Connecting to {CoronadoOptions.Url}...");

            var appDataFolder = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            settingsFile = Path.Combine(appDataFolder, "coronado.config");
            CoronadoOptions.Bind(settingsFile);
        }

        private static async Task DoTask(IEnumerable<ICommand> commands)
        {
            if (string.IsNullOrWhiteSpace(CoronadoOptions.BearerToken))
            {
                // Log in
                var bearerToken = await LogIn().ConfigureAwait(false);
                File.AppendAllText(settingsFile, "Bearer " + bearerToken + "\n");
            }
            await LoadDashboardStats().ConfigureAwait(false);
            while (true)
            {
                ReadLine.HistoryEnabled = true;
                var prompt = "> ";
                if (context.SelectedAccount != null) {
                    prompt = context.SelectedAccount.Name + " " + prompt;
                }
                var entry = ReadLine.Read(prompt);
                var command = commands.SingleOrDefault(c => c.Matches(entry));

                ReadLine.HistoryEnabled = false;
                if (command != null) {
                    await command.Execute(context, entry).ConfigureAwait(false);
                } else if (entry == "quit" || entry == "q")
                {
                    break;
                } else {
                    // Invalid command, remove it from command history
                    ReadLine.GetHistory().RemoveAt(ReadLine.GetHistory().Count - 1);
                }
            }

        }

        private static async Task LoadDashboardStats()
        {
            var api = new CoronadoApi();
            var stats = await api.Get<DashboardStats>("reports/GetDashboardStats").ConfigureAwait(false);
            Console.WriteLine($"Net worth...............{Math.Round(stats.NetWorth, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Net worth last month....{Math.Round(stats.NetWorthLastMonth, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Change..................{Math.Round(stats.NetWorthChange, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Liquid assets...........{Math.Round(stats.LiquidAssetsBalance, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Credit cards............{Math.Round(stats.CreditCardBalance, 2).ToString("C2").PadLeft(18, '.')}");
        }

        private static async Task<string> LogIn()
        {
            Console.Write("Username: ");
            var username = Console.ReadLine();
            Console.Write("Password: ");
            var password = Console.ReadLine();
            Console.WriteLine("Logging in...");
            var api = new CoronadoApi();
            return await api.Login(username, password).ConfigureAwait(false);
        }
    }
}
