using System;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{

    public interface IInvestmentPriceRepository
    {
        InvestmentPrice Delete(Guid investmentPriceId);
        void Insert(InvestmentPrice investmentPrice);
    }
}
