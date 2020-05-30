using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{

    [Table("transfers")]
    public class Transfer
    {
        [Key]
        public Guid TransferId { get; set; }
        public Guid LeftTransactionId { get; set; }
        public Guid RightTransactionId { get; set; }
        public Transaction LeftTransaction { get; set; }
        public Transaction RightTransaction { get; set; }
    }

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
        public DateTime EnteredDate {get;set;} = DateTime.Now;
        public Guid? InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
        public TRANSACTION_TYPE TransactionType { get; set; }
    }

    public enum TRANSACTION_TYPE {
        REGULAR,
        TRANSFER,
        INVOICE_PAYMENT,
        INVESTMENT
    }
}
