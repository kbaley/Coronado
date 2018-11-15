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

    class InvoiceForPosting
    {
        public Guid InvoiceId { get; set; }
        public DateTime Date { get; set; }
        public Guid CustomerId { get; set; }
        public IEnumerable<InvoiceLineItemsForPosting> LineItems { get; set; }
    }

  public class InvoiceLineItemsForPosting
  {
      public Guid LineItemId { get; set; }
      public decimal Quantity { get; set; }
      public decimal UnitAmount { get; set; }
      public string Description { get; set; }
  }
}