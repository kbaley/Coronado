using System;
using Coronado.Web.Domain;

namespace Coronado.Web.Models
{
    public class TransactionForDisplay
    {
        public Guid TransactionId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public string CategoryName { get; set; }
        public Guid? CategoryId { get; set; }
        public string CategoryDisplay { get; set; }
        public string AccountName { get; set; }
        public Guid? AccountId { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public decimal Amount { get; set; }
        public Guid? RelatedTransactionId { get; set; }
        public string RelatedAccountName { get; set; }
        public Guid? RelatedAccountId { get; set; }

        public DateTime EnteredDate { get; set; }

        public bool IsReconciled { get; set; }
        public Guid? InvoiceId { get; set; }
        public string InvoiceNumber { get; set; }

        public decimal RunningTotal { get; set; }

        public void SetAmount() {
            Amount = Debit.HasValue ? (0 - Debit.Value) : Credit.Value;
        }

        public void SetDebitAndCredit() {
            if (Amount < 0) {
                Debit = 0 - Amount;
            } else {
                Credit = Amount;
            }
        }
    }
}
