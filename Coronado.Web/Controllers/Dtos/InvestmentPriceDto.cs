using System;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvestmentPriceDto {
        public Guid InvestmentPriceId { get; set; }
        public Guid InvestmentId { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
    }
}
