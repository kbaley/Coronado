using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Coronado.Web.Models;

namespace Coronado.Web.Controllers {
    class TransactionHelpers {

        public static Category GetOrCreateCategory(string name, ICategoryRepository categoryRepo) {

            var category = categoryRepo.GetAll().SingleOrDefault(c => c.Name.Equals(name, StringComparison.CurrentCultureIgnoreCase));
            if (category == null) {
                category = new Category {
                    CategoryId = Guid.NewGuid(),
                    Name = name,
                    Type = "Expense"
                };
                categoryRepo.Insert(category);
            }
            return category;
        }
        public static IEnumerable<TransactionForDisplay> GetBankFeeTransactions(TransactionForDisplay newTransaction, 
            ICategoryRepository categoryRepo, IAccountRepository accountRepo) {
            var transactions = new List<TransactionForDisplay>();
            var description = newTransaction.Description;

            var category = GetOrCreateCategory("Bank Fees", categoryRepo);
            var account = accountRepo.Get(newTransaction.AccountId.Value);
            if (description.Contains("bf:", StringComparison.CurrentCultureIgnoreCase)) {
                newTransaction.Description = description.Substring(0, description.IndexOf("bf:", StringComparison.CurrentCultureIgnoreCase));
                var parsed = description.Substring(description.IndexOf("bf:", 0, StringComparison.CurrentCultureIgnoreCase));
                while (parsed.StartsWith("bf:", StringComparison.CurrentCultureIgnoreCase)) {
                    var next = parsed.IndexOf("bf:", 1, StringComparison.CurrentCultureIgnoreCase);
                    if (next == -1) next = parsed.Length;
                    var transactionData = (parsed.Substring(3, next - 3)).Trim().Split(" ");
                    decimal amount;
                    if (decimal.TryParse(transactionData[0], out amount)) {
                        var bankFeeDescription = string.Join(" ", transactionData.Skip(1).ToArray());
                        var transaction = new TransactionForDisplay {
                            TransactionId = Guid.NewGuid(),
                            TransactionDate = newTransaction.TransactionDate,
                            AccountId = newTransaction.AccountId,
                            CategoryId = category.CategoryId,
                            Description = bankFeeDescription,
                            Vendor = account.Vendor,
                            Amount = 0 - amount,
                            Debit = amount,
                            EnteredDate = newTransaction.EnteredDate
                        };
                        transactions.Add(transaction);
                    }
                    parsed = parsed.Substring(next);
                } 
            }
            return transactions;
        }
    }
}