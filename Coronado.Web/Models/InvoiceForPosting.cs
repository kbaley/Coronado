using System;
using System.Collections.Generic;

namespace Coronado.Web.Models
{
  public class InvoiceForPosting
    {
        public Guid InvoiceId { get; set; }
        public DateTime Date { get; set; }
        public Guid CustomerId { get; set; }
        public IEnumerable<InvoiceLineItemsForPosting> LineItems { get; set; }
        public string CustomerName { get; set; }
        public string Number { get; set; }
    }
}