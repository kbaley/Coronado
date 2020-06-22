using System;
using System.Collections.Generic;
using System.Text;

namespace Coronado.ConsoleApp.Domain.Formatters
{

    public abstract class Formatter<T> where T : IHasAlias {
        protected readonly Dictionary<Func<T, object>, FormatOptions> _formatters = new Dictionary<Func<T, object>, FormatOptions>();

        public string Format(T item) {
            
            var builder = new StringBuilder();
            builder.Append(item.Alias.PadLeft(4) + " ");
            foreach (var key in _formatters.Keys)
            {
                var value = key(item);
                if (value is string) {
                    builder.Append(_formatters[key].Format(key(item).ToString()));
                } else if (value is decimal) {
                    builder.Append(_formatters[key].Format((decimal)key(item)));
                } else if (value is double) {
                    builder.Append(_formatters[key].Format((double)key(item)));
                } else if (value is DateTime) {
                    builder.Append(_formatters[key].Format((DateTime)key(item)));
                }
            }

            return builder.ToString();
        }
    }
}
