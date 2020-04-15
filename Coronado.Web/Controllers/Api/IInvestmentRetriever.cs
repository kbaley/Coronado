using System.Collections.Generic;
using System.Threading.Tasks;

namespace Coronado.Web.Controllers.Api
{
    public interface IInvestmentRetriever
    {
        string RetrieveDataFor(string symbol, double start);
        Task<string> RetrieveTodaysPricesFor(IEnumerable<string> symbols);
    }
}
