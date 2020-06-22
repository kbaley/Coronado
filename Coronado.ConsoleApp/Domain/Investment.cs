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
    }

    public class InvestmentModel {
        public IEnumerable<Investment> Investments { get; set; }
        public double PortfolioIrr { get; set; }

    }
}
