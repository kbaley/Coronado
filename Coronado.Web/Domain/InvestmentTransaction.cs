using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
    [Table("investment_transactions")]
    public class InvestmentTransaction
    {
        [Key]
        public Guid InvestmentTransactionId { get; set; }
        [Required]
        public Guid InvestmentId {get; set; }
        public decimal Shares { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; }

        public Guid TransactionId { get; set; }
        public Transaction Transaction { get; set; }
        public Guid? GetAccountId() {
            if (Transaction == null) return null;
            return Transaction.AccountId;
        }
        public string GetAccountName() {
            if (Transaction == null) return null;
            return Transaction.Account.Name;
        }
    }
}
