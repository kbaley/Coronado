using System;
using System.Collections.Generic;
using Coronado.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Npgsql;

namespace Coronado.Web.Data
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public TransactionRepository(IConfiguration config)
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

        public void Delete(Guid transactionId) {
            using (var conn = Connection) {
                conn.Open();
                var trx = conn.BeginTransaction();

                // Check for a related transaction
                var relatedTransactionId = conn.ExecuteScalar<Guid>(
@"SELECT related_transaction_id
    FROM transactions
    WHERE transaction_id = @TransactionId", new {transactionId});
                if (relatedTransactionId != null && relatedTransactionId != Guid.Empty) {
                    // Related transaction exists; delete it first (after clearing the FK relationship)
                    conn.Execute("UPDATE transactions SET related_transaction_id = null WHERE transaction_id = @TransactionId", transactionId);
                    conn.Execute("DELETE FROM transactions WHERE transaction_id = @TransactionId",
                        new { TransactionId = relatedTransactionId });
                }
                conn.Execute("DELETE FROM transactions WHERE transaction_id = @TransactionId", new {transactionId});
                trx.Commit();
            }
        }

        public void Update(TransactionForDisplay transaction) {
            using (var conn = Connection) {
                conn.Open();
                conn.Execute(
@"UPDATE transactions
    SET account_id = @AccountId, vendor = @Vendor, description = @Description, is_reconciled = @IsReconciled, 
    transaction_date = @TransactionDate, category_id = @CategoryId, amount = @Amount, 
    related_transaction_id = @RelatedTransactionId
    WHERE transaction_id = @TransactionId", transaction);
            }
        }

        public void Insert(TransactionForDisplay transaction) {
            using (var conn = Connection) {
                conn.Open();
                conn.Execute(
@"INSERT INTO transactions (transaction_id, account_id, vendor, description, is_reconciled, transaction_date, category_id,
    entered_date, amount, related_transaction_id)
    VALUES (@TransactionId, @AccountId, @Vendor, @Description, @IsReconciled, @TransactionDate, @CategoryId,
    @EnteredDate, @Amount, @RelatedTransactionId)
", transaction );
            }
        }
        public IEnumerable<TransactionForDisplay> GetByAccount(Guid accountId)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                var transactions = dbConnection.Query<TransactionForDisplay>(
@"SELECT t.*, a.name as AccountName, c.name as CategoryName, a1.account_id as RelatedAccountId, a1.name as RelatedAccountName
FROM transactions t
LEFT JOIN accounts a
ON t.account_id = a.account_id
LEFT JOIN categories c
ON t.category_id = c.category_id
LEFT JOIN transactions t1
ON t.related_transaction_id = t1.transaction_id
LEFT JOIN accounts a1
ON t1.account_id = a1.account_id
WHERE t.account_id=@AccountId;", new { AccountId = accountId });
                foreach (var transaction in transactions)
                {
                    transaction.SetDebitAndCredit();
                    if (transaction.RelatedTransactionId.HasValue) 
                    {
                        transaction.CategoryDisplay = "TRF: " + transaction.RelatedAccountName;
                    } else {
                        transaction.CategoryDisplay = transaction.CategoryName;
                    }
                }
                return transactions;
            }
        }

        public TransactionForDisplay Get(Guid transactionId)
        {
            using (IDbConnection dbConnection = Connection)
            {
                dbConnection.Open();
                var transaction = dbConnection.QuerySingle<TransactionForDisplay>(
@"SELECT t.*, a.name as AccountName, c.name as CategoryName, a1.account_id as RelatedAccountId, a1.name as RelatedAccountName
FROM transactions t
LEFT JOIN accounts a
ON t.account_id = a.account_id
LEFT JOIN categories c
ON t.category_id = c.category_id
LEFT JOIN transactions t1
ON t.related_transaction_id = t1.transaction_id
LEFT JOIN accounts a1
ON t1.account_id = a1.account_id
WHERE t.transaction_id=@transactionId;", new {transactionId});
                transaction.SetDebitAndCredit();
                if (transaction.RelatedTransactionId.HasValue) 
                {
                    transaction.CategoryDisplay = "TRF: " + transaction.RelatedAccountName;
                } else {
                    transaction.CategoryDisplay = transaction.CategoryName;
                }
                return transaction;
            }
        }
    }
}
