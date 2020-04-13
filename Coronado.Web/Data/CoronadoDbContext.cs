using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Coronado.Web.Data
{
    public class CoronadoDbContext : DbContext
    {
        public CoronadoDbContext(DbContextOptions<CoronadoDbContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Vendor> Vendors { get;set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<InvestmentPrice> InvestmentPrices { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                // Replace table names
                entity.SetTableName(entity.GetTableName().ToSnakeCase());

                // Replace column names            
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(property.Name.ToSnakeCase());
                }

                foreach (var key in entity.GetKeys())
                {
                    key.SetName(key.GetName().ToSnakeCase());
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.SetConstraintName(key.GetConstraintName().ToSnakeCase());
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.SetName(index.GetName().ToSnakeCase());
                }
            }

        }
    }

    public static class DbContextExtensions {

        public static IQueryable<Account> GetAccountBalances(this DbSet<Account> accounts) {

            return accounts.FromSqlRaw<Account>(
@"SELECT account_id, sum(amount) as current_balance
FROM Transactions
GROUP BY account_id"
            );
        }

        public async static Task<Currency> FindBySymbol(this DbSet<Currency> currencies, string symbol) {
            return await currencies.FirstOrDefaultAsync(c => c.Symbol == symbol);
        }

        public async static Task<Category> GetOrCreateCategory(this CoronadoDbContext context, string newCategoryName) {
            var categories = await context.Categories.ToListAsync().ConfigureAwait(false);
            var category = categories
                .SingleOrDefault(c => c.Name.Equals(newCategoryName, StringComparison.CurrentCultureIgnoreCase));
            if (category == null) {
                category = new Category {
                    CategoryId = Guid.NewGuid(),
                    Name = newCategoryName,
                    Type = "Expense"
                };
                await context.Categories.AddAsync(category).ConfigureAwait(false);
                await context.SaveChangesAsync();
            }
            return category;
        }

        public async static Task RemoveById<T>(this DbSet<T> items, Guid id) where T: class
        {
            var item = await items.FindAsync(id).ConfigureAwait(false);
            items.Remove(item);
        }
    }
}
