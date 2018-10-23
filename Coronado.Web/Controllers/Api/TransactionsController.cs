﻿using System;
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
    public class TransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITransactionRepository _transactionRepo;

        public TransactionsController(ApplicationDbContext context, ITransactionRepository transactionRepo)
        {
            _context = context;
            _transactionRepo = transactionRepo;
        }

        // GET: api/Transactions
        [HttpGet]
        public IEnumerable<TransactionForDisplay> GetTransactions([FromQuery] UrlQuery query )
        {
            var transactions = _transactionRepo.GetByAccount(query.AccountId);

            return transactions;
        }
        
        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transaction = await _context.Transactions.FindAsync(id);
            _context.Entry(transaction).Reference(t => t.Account).Load();
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return Ok(transaction);
        }

        private bool TransactionExists(Guid id)
        {
            return _context.Transactions.Any(e => e.TransactionId == id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSimpleTransaction([FromRoute] Guid id, 
                [FromBody] TransactionForDisplay simpleTransaction) {

            if (id != simpleTransaction.TransactionId)
            {
                return BadRequest();
            }


            var transaction = _context.Transactions.Find(simpleTransaction.TransactionId);
            try
            {
                transaction.Vendor = simpleTransaction.Vendor;
                transaction.Description = simpleTransaction.Description;
                transaction.TransactionDate = simpleTransaction.TransactionDate;
                transaction.Category = _context.Categories.Find(simpleTransaction.CategoryId);
                transaction.Amount = simpleTransaction.Amount;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransactionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(TransactionForDisplay.FromTransaction(transaction));
        }

        [HttpPost]
        public IActionResult PostSimpleTransaction([FromBody] TransactionForDisplay transaction)
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
            Category category;
            Guid? relatedTransactionId = null;
            if (transaction.CategoryId == null) {
                category = _context.Categories.FirstOrDefault(c => (c.Name.Equals(transaction.CategoryName, StringComparison.CurrentCultureIgnoreCase)));
            } else {
                category = _context.Categories.Find(transaction.CategoryId);
            }

            var newTransaction = new Transaction {
                TransactionId = transaction.TransactionId,
                TransactionDate = transaction.TransactionDate,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                Account = account,
                Category = category,
                Amount = transaction.Amount,
                RelatedTransactionId = relatedTransactionId
            };

            var bankFeeTransactions = GetBankFeeTransactions(newTransaction, account);
            transactions.Add(newTransaction);
            transactions.AddRange(bankFeeTransactions);
            _context.Transactions.AddRange(transactions);
            _context.SaveChanges();
            newTransaction.Account = null;

            return CreatedAtAction("GetTransaction", new { id = newTransaction.TransactionId }, 
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
                            TransactionDate = newTransaction.TransactionDate,
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

    public class UrlQuery
    {
        public Guid AccountId { get; set; }
    }
}