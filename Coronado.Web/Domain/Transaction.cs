using System;
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
        public Guid CategoryId { get; set; }
        public DateTime EnteredDate {get;set;} = DateTime.Now;

        public Guid? RelatedTransactionId { get; set; }
        public Transaction RelatedTransaction { get; set; }
        public Guid? InvoiceId { get; set; }
        public Invoice Invoice { get; set; }
    }
}
