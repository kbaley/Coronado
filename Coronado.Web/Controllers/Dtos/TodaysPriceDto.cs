using System;

namespace Coronado.Web.Controllers.Dtos
{
    public class TodaysPriceDto {
        public Guid InvestmentId { get; set; }
        public string Name { get; set; }
        public decimal LastPrice { get; set; }
    }
}
