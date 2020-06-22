using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Commands;
using Coronado.ConsoleApp.Domain;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
            await LoadLocalStore().ConfigureAwait(false);
            await DoTask().ConfigureAwait(false);
        }

        static async Task LoadLocalStore()
        {

            using var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(CoronadoOptions.Url + "accounts")
            };
            request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
            var response = client.SendAsync(request).GetAwaiter().GetResult();
            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            context.Accounts = JsonConvert.DeserializeObject<List<Account>>(json);
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

        private static async Task DoTask()
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
                if (context.SelectedAccount != null) {
                    Console.Write(context.SelectedAccount.Name + " ");
                }
                Console.Write("> ");
                var command = Console.ReadLine();
                if (command == "la" || command == "list-accounts")
                {
                    await new ListAccounts().Execute(context).ConfigureAwait(false);
                }
                else if (Regex.Match(command, "^ga\\d{1,2}$").Success)
                {
                    await new OpenAccount().Execute(context, command).ConfigureAwait(false);
                }
                if (command == "li" || command == "list-investments")
                {
                    await new ListInvestments().Execute(context).ConfigureAwait(false);
                }
                else if (command == "quit" || command == "q")
                {
                    break;
                }
            }

        }

        private static async Task LoadDashboardStats()
        {
            using var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(CoronadoOptions.Url + "reports/GetDashboardStats")
            };
            request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
            var response = client.SendAsync(request).GetAwaiter().GetResult();
            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var stats = JsonConvert.DeserializeObject<DashboardStats>(json);
            Console.WriteLine($"Net worth...............{Math.Round(stats.NetWorth, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Net worth last month....{Math.Round(stats.NetWorthLastMonth, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Change..................{Math.Round(stats.NetWorthChange, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Liquid assets...........{Math.Round(stats.LiquidAssetsBalance, 2).ToString("C2").PadLeft(18, '.')}");
            Console.WriteLine($"Credit cards............{Math.Round(stats.CreditCardBalance, 2).ToString("C2").PadLeft(18, '.')}");
        }

        private static async Task<string> LogIn()
        {
            using var client = new HttpClient();
            Console.Write("Username: ");
            var username = Console.ReadLine();
            Console.Write("Password: ");
            var password = Console.ReadLine();
            Console.WriteLine("Logging in...");
            var requestUri = $"accounts/";
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(CoronadoOptions.Url + "Auth/login")
            };
            request.Content = new StringContent(
                $"{{Email: '{username}', Password: '{password}'}}",
                Encoding.UTF8, "application/json");
            var response = await client.SendAsync(request).ConfigureAwait(false);
            var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            dynamic retrievedToken = JsonConvert.DeserializeObject(responseJson);
            return retrievedToken.token;
        }
    }
}
