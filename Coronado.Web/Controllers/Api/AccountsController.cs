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
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("newId")]
        public Guid GetNewId()
        {
            return Guid.NewGuid();
        }

        // GET: api/Accounts
        [HttpGet]
        public IEnumerable<Account> GetAccounts()
        {
            return _context.Accounts;
        }

        // GET:sapi/Accounts/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccount([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var account = await _context.Accounts.FindAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            _context.Entry(account).Collection(a => a.Transactions).Query().Include(t => t.Category).Load();
            var transactionsModel = account.Transactions.Select(AccountWithTransactions.AccountTransaction.FromTransaction);
            var model = new AccountWithTransactions
            {
                AccountId = account.AccountId,
                Name = account.Name,
                Transactions = transactionsModel
            };

            return Ok(model);
        }

        // PUT: api/Accounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount([FromRoute] Guid id, [FromBody] Account account)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != account.AccountId)
            {
                return BadRequest();
            }

            _context.Entry(account).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Accounts
        [HttpPost]
        public IActionResult PostAccount([FromBody] AccountForPosting account)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newAccount = new Account
            {
                AccountId = Guid.NewGuid(),
                Name = account.Name,
                Currency = account.Currency,
                CurrentBalance = account.StartingBalance
            };

            using (var dbTrx = _context.Database.BeginTransaction())
            {
                var category = _context.Categories.First(c => c.Name == "Starting Balance");
                _context.Accounts.Add(newAccount);

                var transaction = new Transaction
                {
                    Account = newAccount,
                    Credit = account.StartingBalance,
                    Date = account.StartDate,
                    Description = "Start Balance",
                    Category = category
                };
                _context.Transactions.Add(transaction);
                _context.SaveChanges();
                dbTrx.Commit();
            }
            newAccount.Transactions.Clear();

            return CreatedAtAction("GetAccount", new { id = newAccount.AccountId }, newAccount);
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var account = await _context.Accounts.FindAsync(id);
            if (account == null)
            {
                return NotFound();
            }

            _context.Accounts.Remove(account);
            await _context.SaveChangesAsync();

            return Ok(account);
        }

        private bool AccountExists(Guid id)
        {
            return _context.Accounts.Any(e => e.AccountId == id);
        }
    }
}