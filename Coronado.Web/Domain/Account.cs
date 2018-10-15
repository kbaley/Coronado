using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Coronado.Web.Domain
{
    [Table("accounts")]
    public class Account
    {
        [Key]
        public Guid AccountId { get; set; }

        public string Name { get; set; }

        public decimal CurrentBalance { get; set; }

        [Required]
        [DefaultValue("USD")]
        public string Currency {get;set;}

        public string Vendor { get; set; }

        public IList<Transaction> Transactions {get;set;} = new List<Transaction>();

    }
}