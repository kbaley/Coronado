using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public interface IInvestmentRepository
    {
        IEnumerable<Investment> GetAll();
        void Update(Investment investment);
        Investment Delete(Guid investmentId);
        void Insert(Investment investment);
    }
}
