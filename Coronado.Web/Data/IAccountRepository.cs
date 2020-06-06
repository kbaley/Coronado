using System.Collections.Generic;
using Coronado.Web.Controllers.Dtos;

namespace Coronado.Web.Data
{
    public interface IAccountRepository {
        IEnumerable<AccountIdAndBalance> GetAccountBalances();
    }
}
