using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .AddCommandLine(args)
                .AddUserSecrets<Program>(false)
                .Build();

            var coronadoOptions = new CoronadoOptions();
            config.GetSection(CoronadoOptions.Coronado).Bind(coronadoOptions);

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var appDataFolder = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var settingsFile = Path.Combine(appDataFolder, "coronado.config");
            var token = "";
            if (File.Exists(settingsFile)) {
                var settings = File.ReadAllLines(settingsFile);
                if (settings.Any(l => l.StartsWith("Bearer "))) {
                    token = settings.First(l => l.StartsWith("Bearer "));
                }
            }
            if (string.IsNullOrWhiteSpace(token)) {
                // Log in
                Console.Write("Username: ");
                var username = Console.ReadLine();
                Console.Write("Password: ");
                var password = Console.ReadLine();
                Console.WriteLine("Logging in...");
                var requestUri = $"accounts/";
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(coronadoOptions.Url + "Auth/login")
                };
                request.Content = new StringContent(
                    $"{{Email: '{username}', Password: '{password}'}}",
                    Encoding.UTF8, "application/json");
                var response = client.SendAsync(request).GetAwaiter().GetResult();
                System.Console.WriteLine(response.StatusCode);
                var responseJson = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                dynamic retrievedToken = JsonConvert.DeserializeObject(responseJson);
                File.AppendAllText(settingsFile, "Bearer " + retrievedToken.token + "\n");
            } else {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(coronadoOptions.Url + "accounts")
                };
                request.Headers.Add("Authorization", token);
                var response = client.SendAsync(request).GetAwaiter().GetResult();
                var json = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                System.Console.WriteLine(json);
            }

        }
    }
}
