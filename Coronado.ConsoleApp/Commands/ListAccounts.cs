using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Coronado.ConsoleApp.Domain;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp.Commands
{
    public class ListAccounts {

        public async Task Execute() {
            using var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(CoronadoOptions.Url + "accounts")
            };
            request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
            var response = client.SendAsync(request).GetAwaiter().GetResult();
            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            // System.Console.WriteLine(json);
            IEnumerable<Account> accounts = JsonConvert.DeserializeObject<List<Account>>(json);
            accounts = accounts
                .Where(a => !a.IsHidden)
                .OrderBy(a => a.DisplayOrder);
            foreach (var item in accounts)
            {
                item.Alias = $"a{item.DisplayOrder + 1}";
                Console.WriteLine(item);
            }
        }
    }
}
