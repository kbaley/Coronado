using System;

namespace Coronado.Web.Models
{
  public class InvoiceLineItemsForPosting
  {
      public Guid LineItemId { get; set; }
      public decimal Quantity { get; set; }
      public decimal UnitAmount { get; set; }
      public string Description { get; set; }
  }
}