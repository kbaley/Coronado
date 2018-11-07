using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public interface IAccountRepository {
        IEnumerable<Account> GetAll();
        void Update(Account account);
        void Insert(Account newAccount);
        Account Delete(Guid accountId);
        Account Get(Guid accountId);
        IEnumerable<Account> GetAccountBalances();
    }
}
