using System;
using System.Collections.Generic;
using Coronado.Web.Controllers.Dtos;

namespace Coronado.Web.Data
{
  public interface IInvoiceRepository
    {
        IEnumerable<InvoiceForPosting> GetAll();
        void Update(InvoiceForPosting invoice);
        InvoiceForPosting Delete(Guid customerId);
        void Insert(InvoiceForPosting invoice);
        InvoiceForPosting Get(Guid invoiceId);
        void UpdateBalances();
        void RecordEmail(InvoiceForPosting invoice, DateTime? date);
    }
}
