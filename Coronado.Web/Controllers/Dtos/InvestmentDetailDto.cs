using System;
using System.Collections.Generic;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvestmentDetailDto
    {
        public Guid InvestmentId { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public string Currency { get; set; }
        public bool DontRetrievePrices { get; set; }
        public decimal Shares { get; set; }
        public decimal LastPrice { get; set; }
        public decimal AveragePrice { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal CurrentValue { get; set; }
        public double TotalAnnualizedReturn { get; set; }
        public decimal TotalReturn { get; set; } 
        public IEnumerable<InvestmentPriceDto> HistoricalPrices { get; set; }
        public IEnumerable<InvestmentTransactionDto> Transactions { get; set; }
    }
}
