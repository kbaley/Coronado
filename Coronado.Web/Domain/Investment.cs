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
        public decimal Shares { get; set; }
        public decimal Price { get; set; }
        public string Url { get; set; }
        public DateTime LastRetrieved { get; set; }
        public string Currency { get; set; }
        public IEnumerable<InvestmentPrice> HistoricalPrices { get; set; }

        public bool CanLookUp() {
            return !string.IsNullOrWhiteSpace(Symbol) && LastRetrieved < DateTime.Today;
        }
    }

    public class InvestmentPrice
    {
        [Key]
        public Guid InvestmentPriceId { get; set; }
        [Required]
        public Invoice Invoice { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
    }

}