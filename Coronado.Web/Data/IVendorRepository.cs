using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
  public interface IVendorRepository
    {
        IEnumerable<Vendor> GetAll();
    }
}
