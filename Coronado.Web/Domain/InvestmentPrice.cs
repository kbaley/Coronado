using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
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
}
