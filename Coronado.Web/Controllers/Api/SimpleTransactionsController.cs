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
            try {
            var account = _context.Accounts.FirstOrDefault(a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase));
            var category = _context.Categories.FirstOrDefault(c => (c.Name.Equals(transaction.CategoryName, StringComparison.CurrentCultureIgnoreCase)));

            var newTransaction = new Transaction {
                TransactionId = transaction.TransactionId,
                Date = transaction.TransactionDate,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                Account = account,
                Category = category
            };

            _context.Transactions.Add(newTransaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTransaction", new { id = newTransaction.TransactionId });
            } catch (Exception exception) {
                return Ok(exception.Message);
            }
        }
    }

}