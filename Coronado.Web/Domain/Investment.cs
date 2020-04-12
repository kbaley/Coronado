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
        public Investment() {
            HistoricalPrices = new List<InvestmentPrice>();
        }
        
        [Key]
        public Guid InvestmentId { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public decimal Shares { get; set; }
        public decimal AveragePrice { get; set; }
        [NotMapped]
        public decimal LastPrice { get; set; }
        public DateTime LastRetrieved { get; set; }
        public string Currency { get; set; }
        public List<InvestmentPrice> HistoricalPrices { get; set; }
        public List<InvestmentTransaction> Transactions { get; set; }

        public bool CanLookUp() {
            return !string.IsNullOrWhiteSpace(Symbol) && LastRetrieved < DateTime.Today;
        }
    }

    [Table("investment_transactions")]
    public class InvestmentTransaction
    {
        [Key]
        public Guid InvestmentTransactionId { get; set; }
        [Required]
        public Guid InvestmentId {get; set; }
        public decimal Shares { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; }
    }

    [Table("investment_prices")]
    public class InvestmentPrice
    {
        [Key]
        [Column("investment_price_id")]
        public Guid InvestmentPriceId { get; set; }
        [Required]
        public Guid InvestmentId { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
    }

    public static class InvestmentExtensions {
        public static decimal GetLastPrice(this Investment investment) {
            var lastPrice = investment.HistoricalPrices?
                .OrderByDescending(p => p.Date)
                .FirstOrDefault();
            return lastPrice == null ? 0 : lastPrice.Price;
        }
    }
}