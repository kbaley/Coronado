using System;
using System.Collections.Generic;
using Coronado.Web.Models;

namespace Coronado.Web.Data
{
  public interface IInvoiceRepository
    {
        IEnumerable<InvoiceForPosting> GetAll();
        void Update(InvoiceForPosting invoice);
        InvoiceForPosting Delete(Guid customerId);
        void Insert(InvoiceForPosting invoice);
    }
}
