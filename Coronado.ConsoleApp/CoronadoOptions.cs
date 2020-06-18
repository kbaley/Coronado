using System.IO;
using System.Linq;
using Microsoft.Extensions.Configuration;

namespace Coronado.ConsoleApp
{
    public static class CoronadoOptions
    {
        public const string Coronado = "Coronado";

        public static void Bind(IConfigurationSection section)
        {
            Url = section.GetValue<string>("Url");
        }

        public static void Bind(string settingsFile)
        {
            if (!File.Exists(settingsFile)) return;

            var settings = File.ReadAllLines(settingsFile);
            if (settings.Any(l => l.StartsWith("Bearer ")))
            {
                BearerToken = settings.First(l => l.StartsWith("Bearer "));
            }
        }

        public static string Url { get; set; }
        public static string BearerToken { get; set; }
    }
}
