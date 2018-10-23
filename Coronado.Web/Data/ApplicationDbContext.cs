using System;
using System.Collections.Generic;
using System.Text;
using Coronado.Web.Domain;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Npgsql;

namespace Coronado.Web.Data
{
    public interface ITransactionRepository
    {
        IEnumerable<TransactionForDisplay> GetByAccount(Guid accountId);
    }
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
                    if (transaction.Amount < 0)
                    {
                        transaction.Debit = 0 - transaction.Amount;
                    }
                    else
                    {
                        transaction.Credit = transaction.Amount;
                    }
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
    }
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                // Replace table names
                entity.Relational().TableName = entity.Relational().TableName.ToSnakeCase();

                // Replace column names            
                foreach (var property in entity.GetProperties())
                {
                    property.Relational().ColumnName = property.Name.ToSnakeCase();
                }

                foreach (var key in entity.GetKeys())
                {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase();
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase();
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.Relational().Name = index.Relational().Name.ToSnakeCase();
                }
            }

            builder.Entity<Category>().HasData(
                new Category { CategoryId = Guid.NewGuid(), Name = "Starting Balance", Type = "Income" }
            );

            builder.Entity<Category>().HasData(
                new Category { CategoryId = Guid.NewGuid(), Name = "Bank Fees", Type = "Expense" }
            );
        }
    }
}
