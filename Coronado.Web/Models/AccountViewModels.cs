using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Models
{

  public class AccountForPosting
    {
        public Guid AccountId { get; set; }
        public string Name { get; set; }
        public decimal StartingBalance { get; set; }
        public DateTime StartDate { get; set; }
        public string Currency { get; set; }
        public string Vendor { get; set; }
        public string AccountType { get; set; }
        public decimal? MortgagePayment { get; set; }
        public string MortgageType { get; set; }
    }

    public class AccountWithTransactions
    {
        public string Name { get; set; }
        public Guid AccountId { get; set; }
        public decimal CurrentBalance { get; set; }
        public IEnumerable<TransactionForDisplay> Transactions { get; set; }
    }
}