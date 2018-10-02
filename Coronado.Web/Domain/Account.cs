using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

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

        public IList<Transaction> Transactions {get;set;}
    }
}