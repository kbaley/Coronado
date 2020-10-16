using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{

    [Table("transactions")]
    public class Transaction
    {
        [Key]
        public Guid TransactionId { get; set; }

        public Guid AccountId { get; set; }
        [Required]
        public Account Account { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }

        public decimal Amount { get; set; }
        public bool IsReconciled { get; set; }
        public DateTime TransactionDate { get; set; }
        public Category Category { get; set; }
        public Guid? CategoryId { get; set; }
        public DateTime EnteredDate { get; set; } = DateTime.Now;
        public Guid? InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        public TRANSACTION_TYPE TransactionType { get; set; }
        public Transfer LeftTransfer { get; set; }
        public Transfer RightTransfer { get; set; }
        public decimal AmountInBaseCurrency { get; set; }

        public string GetCategoryDisplay()
        {
            return TransactionType switch
            {
                TRANSACTION_TYPE.REGULAR => Category == null ? "" : Category.Name,
                TRANSACTION_TYPE.INVOICE_PAYMENT => Invoice == null ? "PAYMENT" : "PAYMENT: " + Invoice.InvoiceNumber,
                TRANSACTION_TYPE.TRANSFER => LeftTransfer == null ? "TRANSFER" : "TRANSFER: " + LeftTransfer.RightTransaction.Account.Name,
                TRANSACTION_TYPE.INVESTMENT => "INVESTMENT",
                _ => "",
            };
        }

        public void SetAmountInBaseCurrency(string currency, decimal exchangeRate) {
            if (currency == "USD") {
                AmountInBaseCurrency = Amount;
            } else {
                AmountInBaseCurrency = Math.Round(Amount / exchangeRate, 2);
            }

        }
    }

    public enum TRANSACTION_TYPE
    {
        REGULAR,
        TRANSFER,
        INVOICE_PAYMENT,
        INVESTMENT,
        MORTGAGE_PAYMENT,
    }
}
