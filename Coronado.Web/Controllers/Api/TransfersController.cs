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
        private readonly ITransactionRepository _transactionRepo;

        public TransfersController(ApplicationDbContext context, ITransactionRepository transactionRepo)
        {
            _context = context;
            _transactionRepo = transactionRepo;
        }

        [HttpPost]
        public IActionResult PostTransfer([FromBody] TransactionForDisplay transaction)
        {
            var transactions = new List<TransactionForDisplay>();
            if (transaction.TransactionId == null || transaction.TransactionId == Guid.Empty) transaction.TransactionId = Guid.NewGuid();
            if (!transaction.AccountId.HasValue) {
                transaction.AccountId = _context.Accounts.Single(
                        a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase)).AccountId;
            }
            transaction.SetAmount();
            var relatedTransactionId = Guid.NewGuid();
            var relatedTransaction = new TransactionForDisplay {
                TransactionDate = transaction.TransactionDate,
                TransactionId = relatedTransactionId,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                AccountId = transaction.RelatedAccountId.Value,
                Amount = 0 - transaction.Amount,
                EnteredDate = DateTime.Now,
                RelatedTransactionId = transaction.TransactionId
            };
            relatedTransaction.SetDebitAndCredit();

            transaction.RelatedTransactionId = relatedTransactionId;

            var bankFeeTransactions = GetBankFeeTransactions(transaction);
            transactions.Add(transaction);
            transactions.Add(relatedTransaction);
            transactions.AddRange(bankFeeTransactions);
            _transactionRepo.InsertRelatedTransaction(transaction, relatedTransaction);
            foreach(var trx in bankFeeTransactions) {
                _transactionRepo.Insert(trx);
            }

            return CreatedAtAction("PostTransfer", 
                new { id = transaction.TransactionId }, transactions);
        }

        private IEnumerable<TransactionForDisplay> GetBankFeeTransactions(TransactionForDisplay newTransaction) {
            var transactions = new List<TransactionForDisplay>();
            var description = newTransaction.Description;

            var category = _context.Categories.First(c => c.Name.Equals("bank fees", StringComparison.CurrentCultureIgnoreCase));
            var account = _context.Accounts.Find(newTransaction.AccountId);
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