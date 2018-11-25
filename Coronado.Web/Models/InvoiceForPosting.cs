using System;
using System.Collections.Generic;

namespace Coronado.Web.Models
{
  public class InvoiceForPosting
  {
    public Guid InvoiceId { get; set; }
    public DateTime Date { get; set; }
    public Guid CustomerId { get; set; }
    public List<InvoiceLineItemsForPosting> LineItems { get; set; }
    public string CustomerName { get; set; }
    public string CustomerStreetAddress { get; set; }
    public string CustomerCity { get; set; }
    public string CustomerRegion { get; set; }
    public string InvoiceNumber { get; set; }

    public decimal Balance { get; set; }
  }
}