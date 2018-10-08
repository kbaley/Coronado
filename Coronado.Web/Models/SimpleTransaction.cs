using System;

namespace Coronado.Web.Models
{
    public class SimpleTransaction
    {
        public Guid TransactionId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public string CategoryName { get; set; }
        public string AccountName { get; set; }
        public decimal Amount { get; set; }
        public Guid AccountId { get; set; }
    }
}
