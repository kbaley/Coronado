using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers.Api
{
    public interface IInvestmentPriceParser
    {
        Task UpdatePricesFor(CoronadoDbContext context);
    }
}
