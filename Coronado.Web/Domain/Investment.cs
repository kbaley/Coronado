using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Coronado.Web.Domain
{

    [Table("investments")]
    public class Investment
    {
        [Key]
        public Guid InvestmentId { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public string Currency { get; set; }
        public bool DontRetrievePrices { get; set; }
        public virtual ICollection<InvestmentPrice> HistoricalPrices { get; set; }
        public virtual ICollection<InvestmentTransaction> Transactions { get; set; }

        public decimal GetLastPriceAmount() {
            var lastPrice = GetLastPrice();
            return lastPrice == null ? 0.00m : lastPrice.Price;
        }

        public InvestmentPrice GetLastPrice() {
            if (HistoricalPrices == null || HistoricalPrices.Count() == 0) return null;

            return HistoricalPrices.OrderByDescending(p => p.Date).First();
        }

        public decimal GetTotalReturn() {
            var totalPaid = Transactions.Sum(t => t.Shares * t.Price);
            var currentValue = GetCurrentValue();
            return (currentValue - totalPaid) / currentValue;
        }

        public double GetAnnualizedIrr() {
            if (Transactions.Count == 0) return 0.0;
            var transactionsByDate = Transactions.OrderBy(t => t.Date);
            var startDate = transactionsByDate.First().Date;
            var payments = new List<double>();
            var days = new List<double>();
            foreach (var transaction in transactionsByDate)
            {
                payments.Add(-Convert.ToDouble(transaction.Shares) * Convert.ToDouble(transaction.Price));
                days.Add((transaction.Date - startDate).Days);
            }
            payments.Add(Convert.ToDouble(GetCurrentValue()));
            days.Add((DateTime.Today - startDate).Days);
            return Irr.CalculateIrr(payments.ToArray(), days.ToArray());
        }

        public decimal GetNumberOfShares() {
            return Transactions.Sum(t => t.Shares);
        }

        public decimal GetAveragePricePaid() {
            var numShares = GetNumberOfShares();
            if (numShares == 0) return 0;
            return Transactions.Sum(t => t.Shares * t.Price) / numShares;
        }

        public decimal GetCurrentValue() {
            return GetNumberOfShares() * GetLastPriceAmount();
        }

    }
}
