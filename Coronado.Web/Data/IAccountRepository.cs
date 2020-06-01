using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public interface IAccountRepository {
        IEnumerable<Account> GetAllWithBalances();
        IEnumerable<Account> GetAccountBalances();
    }
}
