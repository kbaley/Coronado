using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace Coronado.ConsoleApp.Domain
{
    public class Investment : IHasAlias {

        public Guid InvestmentId { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public decimal Shares { get; set; }
        public decimal LastPrice { get; set; }
        public decimal AveragePrice { get; set; }
        public string Currency { get; set; }
        public decimal CurrentValue { get; set; }
        public double AnnualizedIrr { get; set; }
        public string Alias { get; set; }

        public int DisplayOrder { get; set; }

        public string Format(Expression<Func<string>> property)
        {
            var propertyInfo = ((MemberExpression)property.Body).Member as PropertyInfo;
            var delg = property.Compile();
            return delg().ToString();
        }

        public string Format2<T>(Func<T> key) {
            return key().ToString();
        }

        public override string ToString() {
            var builder = new StringBuilder();
            builder.Append(Alias.PadLeft(4) + "  ");
            // builder.Append(Name.PadRightWithDots(MaxWidths.InvestmentWidth("Name", 30)));
            // builder.Append(Symbol.PadLeftWithDots(MaxWidths.InvestmentWidth("Symbol", 8)));
            // builder.Append(Shares.PadLeftWithDots(MaxWidths.InvestmentWidth("Shares", 11)));
            builder.Append(AveragePrice.PadLeftWithDots(8));
            builder.Append(LastPrice.PadLeftWithDots(8));
            builder.Append(AnnualizedIrr.ToString("P2").PadLeftWithDots(8));
            builder.Append(CurrentValue.ToString("C2").PadLeftWithDots(12, false));

            return builder.ToString();
        }
    }

    public class InvestmentModel {
        public IEnumerable<Investment> Investments { get; set; }
        public double PortfolioIrr { get; set; }

    }
}
