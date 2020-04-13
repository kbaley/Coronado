using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Coronado.Web.Controllers.Dtos
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
        public string CustomerEmail { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime? LastSentToCustomer { get; set; }

        public decimal Balance { get; set; }
    }

    public class UploadTemplateViewModel
    {
        public IFormFile File { get; set; }
    }
}
