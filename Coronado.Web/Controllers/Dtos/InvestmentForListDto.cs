using System;
using System.Collections.Generic;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvestmentForListDto
    {
        public Guid InvestmentId { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public decimal Shares { get; set; }
        public decimal LastPrice { get; set; }
        public decimal AveragePrice { get; set; }
        public string Currency { get; set; }
        public List<InvestmentPriceDto> HistoricalPrices { get; set; } 
    }

    public class InvestmentPriceDto {
        public Guid InvestmentPriceId { get; set; }
        public Guid InvestmentId { get; set; }
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
    }
}