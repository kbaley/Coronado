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
        private readonly ITransactionRepository _transactionRepo;
        private readonly IAccountRepository _accountRepo;
        private readonly ICategoryRepository _categoryRepo;

        public TransactionsController(ApplicationDbContext context, ITransactionRepository transactionRepo,
            IAccountRepository accountRepo, ICategoryRepository categoryRepo)
        {
            _transactionRepo = transactionRepo;
            _accountRepo = accountRepo;
            _categoryRepo = categoryRepo;
        }

        // GET: api/Transactions
        [HttpGet]
        public IEnumerable<TransactionForDisplay> GetTransactions([FromQuery] UrlQuery query )
        {
            return _transactionRepo.GetByAccount(query.AccountId);
        }
        
        // DELETE: api/Transactions/5
        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transaction = _transactionRepo.Get(id);
            _transactionRepo.Delete(id);

            return Ok(transaction);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTransaction([FromRoute] Guid id, 
                [FromBody] TransactionForDisplay transaction) {

            if (id != transaction.TransactionId)
            {
                return BadRequest();
            }

            transaction.SetAmount();
            _transactionRepo.Update(transaction);

            return Ok(transaction);
        }

        [HttpPost]
        public IActionResult PostTransaction([FromBody] TransactionForDisplay transaction)
        {
            var transactions = new List<TransactionForDisplay>();
            if (transaction.TransactionId == null || transaction.TransactionId == Guid.Empty) transaction.TransactionId = Guid.NewGuid();
            if (transaction.AccountId == null) {
                transaction.AccountId = _accountRepo.GetAll().Single(a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase)).AccountId;
            }
            transaction.SetAmount();
            transaction.EnteredDate = DateTime.Now;
            if (transaction.CategoryId == null) {
                transaction.CategoryId = _categoryRepo.GetAll().Single(c => (c.Name.Equals(transaction.CategoryName, StringComparison.CurrentCultureIgnoreCase))).CategoryId;
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

            var category = _categoryRepo.GetAll().Single(c => c.Name.Equals("bank fees", StringComparison.CurrentCultureIgnoreCase));
            var account = _accountRepo.Get(newTransaction.AccountId.Value);
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
                            CategoryDisplay = category.Name,
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

    public class UrlQuery
    {
        public Guid AccountId { get; set; }
    }
}