using System;
using System.Text.RegularExpressions;

namespace Coronado.Web.Data
{
    public static class StringExtensions
    {
        public static string ToSnakeCase(this string input)
        {
            if (string.IsNullOrEmpty(input)) { return input; }

            var startUnderscores = Regex.Match(input, @"^_+");
            return startUnderscores + Regex.Replace(input, @"([a-z0-9])([A-Z])", "$1_$2").ToLower();
        } 
    }

    public static class GuidExtensions
    {
        public static Guid GetId(this Guid id) 
        {
            return id == null || id == Guid.Empty ? Guid.NewGuid() : id;
        }
    }
}