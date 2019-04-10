using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
  [Table("invoices")]
  public class Invoice
  {
    [Key]
    public Guid InvoiceId { get; set; }    

    [Required]
    public string InvoiceNumber { get; set;}

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public Customer Customer { get; set; }

    public IEnumerable<InvoiceLineItem> LineItems { get; set; }
    public decimal Balance { get; set; }

    public bool IsPaidInFull { get; set; }

    public DateTime? LastSentToCustomer { get; set; }
  }

}