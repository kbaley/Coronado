using System;
using System.Collections.Generic;
using Coronado.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Npgsql;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public class AccountRepository : IAccountRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public AccountRepository(IConfiguration config)
        {
            _config = config;
            _connectionString = config.GetValue<string>("ConnectionStrings:DefaultConnection");
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        internal IDbConnection Connection
        {
            get
            {
                return new NpgsqlConnection(_connectionString);
            }
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

        public void Insert(Account account)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO accounts (account_id, name, currency, vendor, account_type, mortgage_payment, mortgage_type)
VALUES (@AccountId, @Name, @Currency, @Vendor, @AccountType, @MortgagePayment, @MortgageType)", account);
            }
        }

        public void Update(Account account)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE accounts
SET name = @Name, currency = @Currency, vendor = @Vendor, account_type = @AccountType,
    mortgage_payment = @MortgagePayment, mortgage_type = @MortgageType
WHERE account_id = @AccountId", account);
            }
        }
    }
}
