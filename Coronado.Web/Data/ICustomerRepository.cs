using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
  public interface ICustomerRepository
    {
        IEnumerable<Customer> GetAll();
        void Update(Customer customer);
        Customer Delete(Guid customerId);
        void Insert(Customer customer);
    }
}
