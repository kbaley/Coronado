using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
    [Table("accounts")]
    public class Account
    {
        [Key]
        public Guid AccountId { get; set; }

        public string Name { get; set; }

        public decimal StartingBalance { get; set; }
        public decimal CurrentBalance { get; set; }
    }

    [Table("categories")]
    public class Category
    {
        [Key]
        public Guid CategoryId {get;set;}

        [Required]
        public string Name { get; set; }

        [Required]
        public string Type { get; set; }
    }

    [Table("transactions")]
    public class Transaction
    {
        [Key]
        public Guid TransactionId { get; set; }

        [Required]
        public Account Account { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public decimal? Debit { get; set; }
        public decimal? Credit { get; set; }
        public bool IsReconciled { get; set; }
        public DateTime Date { get; set; }
        public Category Category { get; set; }
    }
}