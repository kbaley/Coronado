using System;
using System.Dynamic;
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
    public class SimpleTransactionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SimpleTransactionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetSimpleTransaction() {
            return Ok("moo");
        }

        [HttpPost]
        public async Task<IActionResult> PostSimpleTransaction([FromBody] SimpleTransaction transaction)
        {
            if (transaction.TransactionId == null) transaction.TransactionId = Guid.NewGuid();
            Account account;
            if (transaction.AccountId != null) {
                account = await _context.Accounts.FindAsync(transaction.AccountId);
            } else {
                account = _context.Accounts.FirstOrDefault(a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase));
            }
            await _context.Entry(account).Collection(a => a.Transactions).LoadAsync();
            var category = _context.Categories.FirstOrDefault(c => (c.Name.Equals(transaction.CategoryName, StringComparison.CurrentCultureIgnoreCase)));

            var newTransaction = new Transaction {
                TransactionId = transaction.TransactionId,
                Date = transaction.TransactionDate,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                Account = account,
                Category = category,
                Amount = transaction.Amount
            };

            _context.Transactions.Add(newTransaction);
            await _context.SaveChangesAsync();

            var transactions = _context.Transactions.Include(t => t.Category);
            var model = transactions.Where(t => t.Account.AccountId == account.AccountId).GetTransactionModels();

            return CreatedAtAction("GetTransaction", new { id = newTransaction.TransactionId }, model);
        }
    }

}