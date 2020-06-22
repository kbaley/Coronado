using System;
using System.Collections.Generic;
using System.Text;

namespace Coronado.ConsoleApp.Domain.Formatters
{

    public class InvestmentFormatter {
        readonly Dictionary<Func<Investment, object>, FormatOptions> _formatters = new Dictionary<Func<Investment, object>, FormatOptions>();

        public InvestmentFormatter(IEnumerable<Investment> investments) {
            _formatters.Add(i => i.Name, new FormatOptions(investments.MaxLength(i => i.Name), Alignment.LEFT, true, FormatString.STRING));
            _formatters.Add(i => i.Symbol, new FormatOptions(investments.MaxLength(i => i.Symbol), Alignment.RIGHT, true, FormatString.STRING));
            _formatters.Add(i => i.Shares, new FormatOptions(investments.MaxLength(i => i.Shares, FormatString.DECIMAL), Alignment.RIGHT, true, FormatString.DECIMAL));
            _formatters.Add(i => i.AveragePrice, new FormatOptions(investments.MaxLength(i => i.AveragePrice, FormatString.DECIMAL), Alignment.RIGHT, true, FormatString.DECIMAL));
            _formatters.Add(i => i.LastPrice, new FormatOptions(investments.MaxLength(i => i.LastPrice, FormatString.DECIMAL), Alignment.RIGHT, true, FormatString.DECIMAL));
            _formatters.Add(i => i.AnnualizedIrr, new FormatOptions(investments.MaxLength(i => i.AnnualizedIrr, FormatString.PERCENTAGE), Alignment.RIGHT, true, FormatString.PERCENTAGE));
            _formatters.Add(i => i.CurrentValue, new FormatOptions(investments.MaxLength(i => i.CurrentValue, FormatString.CURRENCY), Alignment.RIGHT, false, FormatString.CURRENCY));
        }

        public string Format(Investment investment) {
            
            var builder = new StringBuilder();
            builder.Append(investment.Alias.PadLeft(4) + " ");
            foreach (var key in _formatters.Keys)
            {
                var value = key(investment);
                if (value is string) {
                    builder.Append(_formatters[key].Format(key(investment).ToString()));
                } else if (value is decimal) {
                    builder.Append(_formatters[key].Format((decimal)key(investment)));
                } else if (value is double) {
                    builder.Append(_formatters[key].Format((double)key(investment)));
                }
            }

            return builder.ToString();
        }
    }
}
