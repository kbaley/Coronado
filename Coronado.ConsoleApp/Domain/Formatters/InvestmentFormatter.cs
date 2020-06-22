using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Coronado.ConsoleApp.Domain.Formatters
{
    public class FormatOptions {
        public int Width { get; set; }
        public Alignment Align { get; set; }
        public bool IncludeTrailingDots { get; set; }
        public string FormatString { get; set; }

        public FormatOptions(int width, Alignment alignment, bool includeTrailingDots, string formatString) {
            Width = width;
            Align = alignment;
            IncludeTrailingDots = includeTrailingDots;
            FormatString = formatString;
        }

        public FormatOptions(Alignment alignment, bool includeTrailingDots, string formatString) 
            : this(0, alignment, includeTrailingDots, formatString) { }

        public string Format(string item) {
            var formatted = Align == Alignment.LEFT 
                ? item.PadRightWithDots(Width, IncludeTrailingDots)
                : item.PadLeftWithDots(Width, IncludeTrailingDots);
            return formatted;
        }

        public string Format(decimal item) {
            var formatted = item.ToString(FormatString);
            return Format(formatted);
        }
    }

    public class FormatString {
        public static string STRING = "";
        public static string DECIMAL = "#,##0.00";
        public static string PERCENTAGE = "P2";
        public static string CURRENCY = "C2";
    }

    public enum Alignment {
        LEFT,
        RIGHT
    }
    public class InvestmentFormatter {
        readonly Dictionary<string, FormatOptions> _formats = new Dictionary<string, FormatOptions>();

        public InvestmentFormatter(IEnumerable<Investment> investments) {
            _formats.Clear();
            _formats.Add("Name", new FormatOptions(Alignment.LEFT, true, FormatString.STRING));
            _formats.Add("Symbol", new FormatOptions(Alignment.RIGHT, true, FormatString.STRING));
            _formats.Add("Shares", new FormatOptions(Alignment.RIGHT, true, FormatString.DECIMAL));
            InitWidths(investments);
        }

        private void InitWidths(IEnumerable<Investment> investments) {
            _formats["Name"].Width = investments.Max(i => i.Name.Length) + 1;
            _formats["Symbol"].Width = investments.Max(i => i.Symbol.Length) + 1;
            _formats["Shares"].Width = investments.Max(i => i.Shares.ToString(FormatString.DECIMAL).Length) + 1;
        }

        public string Format(Investment investment) {
            
            var builder = new StringBuilder();
            builder.Append(Format(() => investment.Name));
            builder.Append(Format(() => investment.Symbol));
            builder.Append(Format(() => investment.Shares));
            // builder.Append(investment.Alias.PadLeft(4) + "  ");
            // builder.Append(investment.Name.PadRightWithDots(_maxWidths.InvestmentWidth("Name", 30)));
            // builder.Append(investment.Symbol.PadLeftWithDots(_maxWidths.InvestmentWidth("Symbol", 8)));
            // builder.Append(investment.Shares.PadLeftWithDots(_maxWidths.InvestmentWidth("Shares", 11)));
            builder.Append(investment.AveragePrice.PadLeftWithDots(8));
            builder.Append(investment.LastPrice.PadLeftWithDots(8));
            builder.Append(investment.AnnualizedIrr.ToString("P2").PadLeftWithDots(8));
            builder.Append(investment.CurrentValue.ToString("C2").PadLeftWithDots(12, false));

            return builder.ToString();
        }

        private string Format(Expression<Func<decimal>> property) {
            var delg = property.Compile();
            var propertyInfo = ((MemberExpression)property.Body).Member as PropertyInfo;
            var formatter = _formats[propertyInfo.Name];
            if (formatter != null) {
                return formatter.Format(delg());
            }
            return delg().ToString();
        }

        private string Format(Expression<Func<string>> property) {
            var delg = property.Compile();
            var propertyInfo = ((MemberExpression)property.Body).Member as PropertyInfo;
            var formatter = _formats[propertyInfo.Name];
            if (formatter != null) {
                return formatter.Format(delg());
            }
            return delg().ToString();
        }

    }

    public static class InvestmentExtensions {
        public static string Format4(this Investment _, Expression<Func<string>> property)
        {
            var propertyInfo = ((MemberExpression)property.Body).Member as PropertyInfo;
            var delg = property.Compile();
            return delg().ToString();
        }

    }
}
