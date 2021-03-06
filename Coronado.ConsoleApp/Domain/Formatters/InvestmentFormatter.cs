using System;
using System.Collections.Generic;
using System.Text;

namespace Coronado.ConsoleApp.Domain.Formatters
{

    public class InvestmentFormatter : Formatter<Investment> {
        public InvestmentFormatter(IEnumerable<Investment> investments) {
            Formatters.Add(i => i.Name, new FormatOptions(investments.MaxLength(i => i.Name), Alignment.LEFT, true, FormatString.STRING));
            Formatters.Add(i => i.Symbol, new FormatOptions(investments.MaxLength(i => i.Symbol), Alignment.RIGHT, true, FormatString.STRING));
            Formatters.Add(i => i.Shares, new FormatOptions(investments.MaxLength(i => i.Shares), Alignment.RIGHT, true, FormatString.DECIMAL));
            Formatters.Add(i => i.AveragePrice, new FormatOptions(investments.MaxLength(i => i.AveragePrice), Alignment.RIGHT, true, FormatString.DECIMAL));
            Formatters.Add(i => i.LastPrice, new FormatOptions(investments.MaxLength(i => i.LastPrice), Alignment.RIGHT, true, FormatString.DECIMAL));
            Formatters.Add(i => i.AnnualizedIrr, new FormatOptions(investments.MaxLength(i => i.AnnualizedIrr, FormatString.PERCENTAGE), Alignment.RIGHT, true, FormatString.PERCENTAGE));
            Formatters.Add(i => i.CurrentValue, new FormatOptions(investments.MaxLength(i => i.CurrentValue), Alignment.RIGHT, false, FormatString.DECIMAL));
        }

    }
}
