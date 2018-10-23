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
        public IActionResult PostTransaction([FromBody] TransactionForDisplay transaction)
        {
            var transactions = new List<TransactionForDisplay>();
            if (transaction.TransactionId == null || transaction.TransactionId == Guid.Empty) transaction.TransactionId = Guid.NewGuid();
            if (transaction.AccountId == null) {
                transaction.AccountId = _context.Accounts.FirstOrDefault(a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase)).AccountId;
            }
            if (transaction.Debit.HasValue) {
                transaction.Amount = 0 - transaction.Debit.Value;
            } else {
                transaction.Amount = transaction.Credit.Value;
            }
            if (transaction.CategoryId == null) {
                transaction.CategoryId = _context.Categories.FirstOrDefault(c => (c.Name.Equals(transaction.CategoryName, StringComparison.CurrentCultureIgnoreCase))).CategoryId;
            }

            var bankFeeTransactions = GetBankFeeTransactions(transaction);
            transactions.Add(transaction);
            transactions.AddRange(bankFeeTransactions);
            foreach(var trx in transactions) {
                _transactionRepo.Insert(trx);
            }

            return CreatedAtAction("PostTransaction", new { id = transaction.TransactionId }, transactions);
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
                            Debit = amount
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