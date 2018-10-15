using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Coronado.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Controllers;

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
            var accounts = _context.Accounts.Include(a => a.Transactions).ToList();
            accounts.ForEach(a => {
                a.CurrentBalance = a.Transactions.Sum(t => t.Amount);
                a.Transactions.Clear();
            });

            return accounts;
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
            var transactionsModel = account.Transactions.GetTransactionModels();
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
        public async Task<IActionResult> PutAccount([FromRoute] Guid id, [FromBody] AccountForPosting account)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != account.AccountId)
            {
                return BadRequest();
            }

            var existingAccount = await _context.Accounts.FindAsync(id);
            existingAccount.Name = account.Name;
            existingAccount.Currency = account.Currency;
            existingAccount.Vendor = account.Vendor;
            existingAccount.AccountType = account.AccountType;

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

            return Ok(existingAccount);
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
                Vendor = account.Vendor,
                AccountType = account.AccountType
            };

            using (var dbTrx = _context.Database.BeginTransaction())
            {
                var category = _context.Categories.First(c => c.Name == "Starting Balance");
                _context.Accounts.Add(newAccount);

                var transaction = new Transaction
                {
                    Account = newAccount,
                    Amount = account.StartingBalance,
                    Date = account.StartDate,
                    Description = "Start Balance",
                    Category = category
                };
                _context.Transactions.Add(transaction);
                _context.SaveChanges();
                dbTrx.Commit();
            }
            var transactionsModel = newAccount.Transactions
                .Select(AccountTransaction.FromTransaction)
                .OrderByDescending(t => t.TransactionDate);
            var model = new AccountForListing
            {
                AccountId = newAccount.AccountId,
                Name = newAccount.Name,
                CurrentBalance = newAccount.CurrentBalance
            };

            return CreatedAtAction("GetAccount", new { id = newAccount.AccountId }, model);
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