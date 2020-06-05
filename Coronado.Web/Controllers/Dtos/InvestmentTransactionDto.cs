using System;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvestmentTransactionDto
    {
        public Guid InvestmentTransactionId { get; set; }
        public decimal Shares { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; }
        public Guid? AccountId { get; set; }
        public string AccountName { get; set; }
    }
}
