using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Domain;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Data
{
    public static class DbContextExtensions
    {

        public static IQueryable<Account> GetAccountBalances(this DbSet<Account> accounts)
        {

            return accounts.FromSqlRaw<Account>(
@"SELECT account_id, sum(amount) as current_balance
FROM Transactions
GROUP BY account_id"
            );
        }

        public async static Task<Currency> FindBySymbol(this DbSet<Currency> currencies, string symbol)
        {
            return await currencies.FirstOrDefaultAsync(c => c.Symbol == symbol);
        }

        public async static Task<Category> GetOrCreateCategory(this CoronadoDbContext context, string newCategoryName)
        {
            var categories = await context.Categories.ToListAsync().ConfigureAwait(false);
            var category = categories
                .SingleOrDefault(c => c.Name.Equals(newCategoryName, StringComparison.CurrentCultureIgnoreCase));
            if (category == null)
            {
                category = new Category
                {
                    CategoryId = Guid.NewGuid(),
                    Name = newCategoryName,
                    Type = "Expense"
                };
                await context.Categories.AddAsync(category).ConfigureAwait(false);
                await context.SaveChangesAsync();
            }
            return category;
        }

        public async static Task RemoveById<T>(this DbSet<T> items, Guid id) where T : class
        {
            var item = await items.FindAsync(id).ConfigureAwait(false);
            items.Remove(item);
        }

        public static decimal GetPaymentsFor(this DbSet<Transaction> transactions, Guid invoiceId)
        {
            return transactions
                .Where(t => t.InvoiceId == invoiceId)
                .Sum(t => t.Amount);
        }
    }
}
