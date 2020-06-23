using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Coronado.ConsoleApp
{
    public class CoronadoApi
    {


        public async Task<IEnumerable<T>> GetList<T>(string uri = "")
        {
            if (string.IsNullOrWhiteSpace(uri))
            {
                uri = typeof(T).Name + "s";
            }
            using var client = new HttpClient();
            var request = GetMessage(uri, HttpMethod.Get);
            var response = client.SendAsync(request).GetAwaiter().GetResult();
            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var items = JsonConvert.DeserializeObject<List<T>>(json);
            return items;
        }

        public async Task<T> Get<T>(string uri = "")
        {
            if (string.IsNullOrWhiteSpace(uri))
            {
                uri = typeof(T).Name + "s";
            }
            using var client = new HttpClient();
            var request = GetMessage(uri, HttpMethod.Get);
            var response = client.SendAsync(request).GetAwaiter().GetResult();
            var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var model = JsonConvert.DeserializeObject<T>(json);
            return model;
        }

        public async Task<T> Post<T>(string uri)
        {
            return await Post<T>(uri, null).ConfigureAwait(false);
        }

        public async Task<T> Post<T>(string uri, dynamic data)
        {

            var client = new HttpClient();
            var request = GetMessage(uri, HttpMethod.Post);
            if (data != null)
            {
                request.Content = new StringContent(JsonConvert.SerializeObject(data),
                    Encoding.UTF8, "application/json");
            }
            var response = await client.SendAsync(request).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var model = JsonConvert.DeserializeObject<T>(responseJson);
            return model;
        }

        public async Task<T> Delete<T>(string uri, Guid id) {
            var client = new HttpClient();
            var request = GetMessage(uri + "/" + id, HttpMethod.Delete);
            var response = await client.SendAsync(request).ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var model = JsonConvert.DeserializeObject<T>(responseJson);
            return model;
        }

        public async Task<string> Login(string email, string password)
        {
            using var client = new HttpClient();
            var request = GetMessage("Auth/login", HttpMethod.Post, false);
            request.Content = new StringContent(
                $"{{Email: '{email}', Password: '{password}'}}",
                Encoding.UTF8, "application/json");
            var response = await client.SendAsync(request).ConfigureAwait(false);
            var responseJson = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            dynamic retrievedToken = JsonConvert.DeserializeObject(responseJson);
            return retrievedToken;
        }

        public HttpRequestMessage GetMessage(string uri, HttpMethod method, bool includeAuthorizationHeader = true)
        {
            var request = new HttpRequestMessage
            {
                Method = method,
                RequestUri = new Uri(CoronadoOptions.Url + uri)
            };
            if (includeAuthorizationHeader)
                request.Headers.Add("Authorization", CoronadoOptions.BearerToken);
            return request;
        }

    }
}
