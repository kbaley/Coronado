using System;
using System.Collections.Generic;
using System.Linq;

namespace Coronado.ConsoleApp.Domain.Formatters
{
    public static class ObjectExtensions {

        public static int MaxLength<T>(this IEnumerable<T> items, Func<T, string> property)
        {
            return Math.Max(items.Max(i => property(i).Length) + 1, 3);
        }

        public static int MaxLength<T>(this IEnumerable<T> investments, Func<T, double> property, string format = FormatString.DECIMAL)
        {
            return investments.Max(i => property(i).ToString(format).Length) + 1;
        }

        public static int MaxLength<T>(this IEnumerable<T> investments, Func<T, decimal> property, string format = FormatString.DECIMAL)
        {
            return investments.Max(i => property(i).ToString(format).Length) + 1;
        }

        public static int MaxLength<T>(this IEnumerable<T> investments, Func<T, DateTime> property, string format = FormatString.SHORT_DATE)
        {
            return investments.Max(i => property(i).ToString(format).Length) + 1;
        }

    }
}
