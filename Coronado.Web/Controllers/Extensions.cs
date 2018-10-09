using System.Collections.Generic;
using Coronado.Web.Models;
using Coronado.Web.Domain;
using System.Linq;

namespace Coronado.Web.Controllers
{
    public static class Extensions {
        public static IEnumerable<AccountTransaction> GetTransactionModels(this IEnumerable<Transaction> transactions) {
            decimal runningTotal = 0;
            return transactions
                .OrderBy(t => t.Date)
                .Select(t => new AccountTransaction{
                    TransactionId = t.TransactionId,
                    TransactionDate = t.Date,
                    Vendor = t.Vendor,
                    Description = t.Description,
                    Amount = t.Amount,
                    CategoryId = t.Category?.CategoryId,
                    CategoryName = t.Category?.Name,
                    RunningTotal = runningTotal += t.Amount
                })
                .OrderByDescending(t => t.TransactionDate);
        }
    }
}