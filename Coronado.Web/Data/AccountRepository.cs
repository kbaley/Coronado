using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Dapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public class AccountRepository : BaseRepository, IAccountRepository
    {
        private readonly ILogger<AccountRepository> _logger;
        public AccountRepository(IConfiguration config, ILogger<AccountRepository> logger) : base(config)
        {
            _logger = logger;
        }

        public IEnumerable<Account> GetAllWithBalances()
        {
            using (var conn = Connection) {
                return conn.Query<Account>(
@"SELECT a.*, (SELECT SUM(amount) FROM transactions WHERE account_id = a.account_id) as current_balance
FROM accounts a"
);
            }
        }

        public IEnumerable<Account> GetAccountBalances() {

            using (var conn = Connection) {
                return conn.Query<Account>(
@"SELECT account_id, sum(amount) as current_balance
FROM Transactions
GROUP BY account_id"
);
            }
        }
    }
}
