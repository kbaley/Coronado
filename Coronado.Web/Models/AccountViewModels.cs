using System;
using System.Collections.Generic;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Http;

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
        public bool IsHidden { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class AccountWithTransactions
    {
        public string Name { get; set; }
        public Guid AccountId { get; set; }
        public decimal CurrentBalance { get; set; }
        public IEnumerable<TransactionForDisplay> Transactions { get; set; }
    }

    public class AccountQifViewModel
    {
        public IFormFile File { get; set; }
        public Guid AccountId { get; set; }
        public DateTime? FromDate { get; set; }
    }

    public class QifTransaction
    {
        public DateTime? Date { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public string Category { get; set; }
        public string Vendor { get; set; }
        public bool Reconciled { get; set; }
    }
}