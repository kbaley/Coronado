using System;
using System.Collections.Generic;
using System.Text;

namespace Coronado.ConsoleApp.Domain.Formatters
{

    public abstract class Formatter<T> where T : IHasAlias {
        protected readonly Dictionary<Func<T, object>, FormatOptions> Formatters = new Dictionary<Func<T, object>, FormatOptions>();

        public string Format(T item) {
            
            var builder = new StringBuilder();
            builder.Append(item.Alias.PadLeft(4) + " ");
            foreach (var key in Formatters.Keys)
            {
                var value = key(item);
                if (value is string) {
                    builder.Append(Formatters[key].Format(key(item).ToString()));
                } else if (value is decimal) {
                    builder.Append(Formatters[key].Format((decimal)key(item)));
                } else if (value is double) {
                    builder.Append(Formatters[key].Format((double)key(item)));
                } else if (value is DateTime) {
                    builder.Append(Formatters[key].Format((DateTime)key(item)));
                }
            }

            return builder.ToString();
        }
    }
}
