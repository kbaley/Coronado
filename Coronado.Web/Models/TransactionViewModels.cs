using System;
using Coronado.Web.Domain;

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
        public string CategoryId { get; set; }
    }

    public class TransferTransaction
    {
        public Guid TransactionId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public Guid AccountId { get; set; }
        public Guid TransferAccountId { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
    }
    
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
        public static TransactionForDisplay FromTransaction(Transaction transaction) {
            var display = new TransactionForDisplay {
                TransactionId = transaction.TransactionId,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                TransactionDate = transaction.TransactionDate,
                AccountName = transaction.Account.Name,
                AccountId = transaction.Account.AccountId,
                EnteredDate = transaction.EnteredDate
            };
            if (transaction.Category != null) {
                display.CategoryName = transaction.Category.Name;
                display.CategoryId = transaction.Category.CategoryId;
                display.CategoryDisplay = transaction.Category.Name;
            }
            if (transaction.RelatedTransaction != null) {
                display.CategoryDisplay = "Transfer: " + transaction.RelatedTransaction.Account.Name;
                display.CategoryId = transaction.RelatedTransaction.Account.AccountId;
            }

            if (transaction.Amount < 0) {
                display.Debit = 0 - transaction.Amount;
            } else {
                display.Credit = transaction.Amount;
            }

            return display;
        }
    }
}
