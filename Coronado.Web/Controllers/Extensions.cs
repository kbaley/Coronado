using System.Collections.Generic;
using Coronado.Web.Models;
using Coronado.Web.Domain;
using System.Linq;

namespace Coronado.Web.Controllers
{
    public static class Extensions {
        public static AccountTransaction ToAccountTransaction(this Transaction transaction) {
            return new AccountTransaction{
                    TransactionId = transaction.TransactionId,
                    TransactionDate = transaction.TransactionDate,
                    Vendor = transaction.Vendor,
                    Description = transaction.Description,
                    Amount = transaction.Amount,
                    CategoryId = transaction.Category?.CategoryId,
                    CategoryName = transaction.Category?.Name
                };
        }
        
        public static IEnumerable<AccountTransaction> GetTransactionModels(this IEnumerable<Transaction> transactions) {
            decimal runningTotal = 0;
            return transactions
                .OrderBy(t => t.TransactionDate)
                .Select(t => new AccountTransaction{
                    TransactionId = t.TransactionId,
                    TransactionDate = t.TransactionDate,
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