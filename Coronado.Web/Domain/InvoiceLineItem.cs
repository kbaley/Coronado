using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Coronado.Web.Domain
{
    [Table("invoice_line_items")]
    public class InvoiceLineItem
    {
        [Key]
        public Guid InvoiceLineItemId { get; set; }

        [Required]
        public Invoice Invoice { get; set; }
        public Guid InvoiceId { get; set; }

        public decimal Quantity { get; set; }
        public decimal UnitAmount { get; set; }
        public string Description { get; set; }

        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        public decimal Amount
        {
            get
            {
                return Quantity * UnitAmount;
            }
        }

    }

}
