using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransfersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransfersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult PostTransfer([FromBody] TransactionForDisplay transaction)
        {
            var transactions = new List<Transaction>();
            if (transaction.TransactionId == null) transaction.TransactionId = Guid.NewGuid();
            Account account;
            if (transaction.AccountId != null) {
                account = _context.Accounts.Find(transaction.AccountId);
            } else {
                account = _context.Accounts.FirstOrDefault(a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase));
            }
            _context.Entry(account).Collection(a => a.Transactions).Load();
            Guid? relatedTransactionId = null;
            relatedTransactionId = Guid.NewGuid();
            var relatedAccountId = Guid.Parse(transaction.CategoryId);
            var relatedAccount = _context.Accounts.Find(relatedAccountId);
            var relatedTransaction = new Transaction {
                Date = transaction.TransactionDate,
                TransactionId = relatedTransactionId.Value,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                Account = relatedAccount,
                Amount = 0 - transaction.Amount
            };
            transactions.Add(relatedTransaction);

            var newTransaction = new Transaction {
                TransactionId = transaction.TransactionId,
                Date = transaction.TransactionDate,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                Account = account,
                Amount = transaction.Amount,
                RelatedTransaction = relatedTransaction
            };
            relatedTransaction.RelatedTransaction = newTransaction;
            _context.Transactions.Add(relatedTransaction);

            var bankFeeTransactions = GetBankFeeTransactions(newTransaction, account);
            transactions.Add(newTransaction);
            transactions.AddRange(bankFeeTransactions);
            _context.Transactions.AddRange(transactions);
            _context.SaveChanges();

            return CreatedAtAction("PostTransfer", 
                new { id = newTransaction.TransactionId }, 
                transactions.Select(TransactionForDisplay.FromTransaction));
        }

        private IEnumerable<Transaction> GetBankFeeTransactions(Transaction newTransaction, Account account) {
            var transactions = new List<Transaction>();
            var description = newTransaction.Description;

            var category = _context.Categories.First(c => c.Name.Equals("bank fees", StringComparison.CurrentCultureIgnoreCase));
            if (description.Contains("bf:", StringComparison.CurrentCultureIgnoreCase)) {
                newTransaction.Description = description.Substring(0, description.IndexOf("bf:", StringComparison.CurrentCultureIgnoreCase));
                var parsed = description.Substring(description.IndexOf("bf:", 0, StringComparison.CurrentCultureIgnoreCase));
                while (parsed.StartsWith("bf:", StringComparison.CurrentCultureIgnoreCase)) {
                    var next = parsed.IndexOf("bf:", 1, StringComparison.CurrentCultureIgnoreCase);
                    if (next == -1) next = parsed.Length;
                    var transactionData = (parsed.Substring(3, next - 3)).Trim().Split(" ");
                    Decimal amount;
                    if (decimal.TryParse(transactionData[0], out amount)) {
                        var bankFeeDescription = string.Join(" ", transactionData.Skip(1).ToArray());
                        var transaction = new Transaction {
                            TransactionId = Guid.NewGuid(),
                            Date = newTransaction.Date,
                            Account = account,
                            Category = category,
                            Description = bankFeeDescription,
                            Vendor = account.Vendor,
                            Amount = 0 - amount
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