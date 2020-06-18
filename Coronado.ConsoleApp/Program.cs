using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Commands;
using Coronado.ConsoleApp.Domain;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp
{
    class Program
    {
        static string settingsFile;
        static async Task Main(string[] args)
        {
            Initialize(args);
            await DoTask().ConfigureAwait(false);
        }

        static void Initialize(string[] args) {

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
            while (true) {
                Console.Write("> ");
                var command = Console.ReadLine();
                switch (command) {
                    case "la":
                    case "list-accounts":
                        await new ListAccounts().Execute().ConfigureAwait(false);
                        break;
                    case "quit":
                    case "q":
                        return;
                }
                if (command == "quit" || command == "q") break;
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

        public class DashboardStats {
            public decimal NetWorth { get; set; }
            public decimal LiquidAssetsBalance { get; set; }
            public decimal CreditCardBalance { get; set; }
            public decimal NetWorthLastMonth { get; set; }
            public decimal NetWorthChange { get {
                return NetWorth - NetWorthLastMonth;
            } }

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
