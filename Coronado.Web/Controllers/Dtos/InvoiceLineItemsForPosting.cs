using System;

namespace Coronado.Web.Controllers.Dtos
{
    public class InvoiceLineItemsForPosting
    {
        public InvoiceLineItemsForPosting()
        {
            Status = "Unchanged";
        }
        public Guid InvoiceLineItemId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitAmount { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public Guid InvoiceId { get; set; }
    }
}
