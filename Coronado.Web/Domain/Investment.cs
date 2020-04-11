using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public decimal Price { get; set; }
        public string Url { get; set; }
        public DateTime LastRetrieved { get; set; }
        public string Currency { get; set; }
        public List<InvestmentPrice> HistoricalPrices { get; set; }

        public bool CanLookUp() {
            return !string.IsNullOrWhiteSpace(Symbol) && LastRetrieved < DateTime.Today;
        }
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
        [NotMapped]
        public string Status { get; set; }
    }

}