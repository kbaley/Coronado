using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Controllers.Dtos;
using Coronado.Web.Domain;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Data
{
    public static class DbContextExtensions
    {

        public static IQueryable<AccountIdAndBalance> GetAccountBalances(this DbSet<Account> accounts) {
            return accounts
                .Select( a => new AccountIdAndBalance {
                    AccountId = a.AccountId,
                    CurrentBalance = a.Transactions.Sum(t => t.Amount),
                    CurrentBalanceInUsd = a.Transactions.Sum(t => t.AmountInBaseCurrency)
                });
        }

        public static double GetAnnualizedIrr(this DbSet<Investment> investments) {
            var transactions = investments
                .SelectMany(i => i.Transactions)
                .OrderBy(t => t.Date)
                .ToList();
            var startDate = transactions.First().Date;
            var payments = new List<double>();
            var days = new List<double>();
            foreach (var trx in transactions)
            {
                payments.Add(0 - (Convert.ToDouble(trx.Shares * trx.Price)));
                days.Add((trx.Date - startDate).Days);
            }
            foreach (var investment in investments)
            {
                payments.Add(Convert.ToDouble(investment.GetCurrentValue()));
                days.Add((DateTime.Today - startDate).Days);
            }
            return Irr.CalculateIrr(payments.ToArray(), days.ToArray());
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

        public async static Task RemoveByIdAsync<T>(this DbSet<T> items, Guid id) where T : class
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

        public async static Task<Invoice> FindInvoiceEager(this CoronadoDbContext context, Guid invoiceId) {
            var invoice = await context.Invoices.FindAsync(invoiceId).ConfigureAwait(false);
            if (invoice != null) {
                await context.Entry(invoice).Collection(i => i.LineItems).LoadAsync().ConfigureAwait(false);
                await context.Entry(invoice).Reference(i => i.Customer).LoadAsync().ConfigureAwait(false);
            }

            return invoice;

        }
    }
}
