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

        public Account Delete(Guid accountId)
        {
            using (var conn = Connection) {
                var accountIdParam = new {accountId};
                var account = conn.QuerySingle<Account>("SELECT * FROM accounts WHERE account_id=@accountId", new {accountId});
                conn.Execute("UPDATE transactions SET related_transaction_id = null WHERE account_id=@accountId", accountIdParam);
                conn.Execute("DELETE FROM transactions WHERE account_id = @accountId", accountIdParam);
                conn.Execute("DELETE FROM accounts WHERE account_id=@accountId", accountIdParam);
                return account;
            }    
        }

        public Account Get(Guid accountId)
        {
            using (var conn = Connection) {
                return conn.QuerySingle<Account>(
@"SELECT a.*, (SELECT SUM(amount) FROM transactions WHERE account_id = a.account_id) as current_balance
FROM accounts a
WHERE account_id=@accountId", new {accountId}
);
            }
        }

        public IEnumerable<Account> GetAll()
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

        public void Insert(Account account)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO accounts (account_id, name, currency, vendor, account_type, mortgage_payment, mortgage_type, is_hidden, display_order)
VALUES (@AccountId, @Name, @Currency, @Vendor, @AccountType, @MortgagePayment, @MortgageType, @IsHidden, @DisplayOrder)", account);
            }
        }

        public void Update(Account account)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE accounts
SET name = @Name, currency = @Currency, vendor = @Vendor, account_type = @AccountType,
    mortgage_payment = @MortgagePayment, mortgage_type = @MortgageType, display_order = @DisplayOrder, is_hidden = @IsHidden
WHERE account_id = @AccountId", account);
            }
        }
    }
}
