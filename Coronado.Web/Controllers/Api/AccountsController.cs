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
        private readonly IAccountRepository _accountRepo;
        private readonly ITransactionRepository _transactionRepo;
        private readonly ICategoryRepository _categoryRepo;

        public AccountsController(ApplicationDbContext context, IAccountRepository accountRepo, 
            ITransactionRepository transactionRepo, ICategoryRepository categoryRepo)
        {
            _accountRepo = accountRepo;
            _transactionRepo = transactionRepo;
            _categoryRepo = categoryRepo;
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
            return _accountRepo.GetAll();
        }

        // PUT: api/Accounts/5
        [HttpPut("{id}")]
        public IActionResult PutAccount([FromRoute] Guid id, [FromBody] Account account)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != account.AccountId)
            {
                return BadRequest();
            }

            _accountRepo.Update(account);

            return Ok(account);
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
            _accountRepo.Insert(newAccount);

            var category = _categoryRepo.GetAll().Single(c => c.Name.Equals("Starting Balance", StringComparison.CurrentCultureIgnoreCase));
            var transaction = new TransactionForDisplay
            {
                AccountId = newAccount.AccountId,
                Amount = account.StartingBalance,
                TransactionDate = account.StartDate,
                Vendor = "",
                Description = "",
                CategoryId = category.CategoryId,
                CategoryName = category.Name,
                EnteredDate = account.StartDate,
                IsReconciled = true
            };
            _transactionRepo.Insert(transaction);

            var model = new AccountWithTransactions {
                AccountId = newAccount.AccountId,
                Name = newAccount.Name,
                Transactions = new List<TransactionForDisplay>(new[] {transaction}),
                CurrentBalance = account.StartingBalance
            };

            return CreatedAtAction("PostAccount", new { id = newAccount.AccountId }, model);
        }

        // DELETE: api/Accounts/5
        [HttpDelete("{id}")]
        public IActionResult DeleteAccount([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var account = _accountRepo.Delete(id);
            return Ok(account);
        }
    }
}