using System.Collections.Generic;
using Coronado.Web.Controllers.Dtos;
using System.Linq;

namespace Coronado.Web.Data
{
    public class AccountRepository : IAccountRepository
    {
        private readonly CoronadoDbContext _context;

        public AccountRepository(CoronadoDbContext context)
        {
            _context = context;
        }

        public IEnumerable<AccountIdAndBalance> GetAccountBalances() {
            return _context.Accounts
                .Select( a => new AccountIdAndBalance {
                    AccountId = a.AccountId,
                    CurrentBalance = a.Transactions.Sum(t => t.Amount),
                    CurrentBalanceInUsd = a.Transactions.Sum(t => t.AmountInBaseCurrency)
                });
        }
    }
}
