﻿using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Coronado.Web.Controllers.Dtos;
using AutoMapper;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly IAccountRepository _accountRepo;
        private readonly ITransactionRepository _transactionRepo;
        private readonly ILogger<AccountsController> _logger;
        private readonly IMapper _mapper;
        private readonly QifParser _qifParser;

        public AccountsController(CoronadoDbContext context, IAccountRepository accountRepo,
            ITransactionRepository transactionRepo, ILogger<AccountsController> logger, IMapper mapper)
        {
            _context = context;
            _accountRepo = accountRepo;
            _transactionRepo = transactionRepo;
            _logger = logger;
            _mapper = mapper;
            _qifParser = new QifParser(context, accountRepo);
        }

        // GET: api/Accounts
        [HttpGet]
        public IEnumerable<Account> GetAccounts()
        {
            return _accountRepo.GetAll();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccount([FromRoute] Guid id, [FromBody] Account account)
        {
            _context.Entry(account).State = EntityState.Modified;
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return Ok(account);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult PostQif([FromForm] AccountQifViewModel model)
        {
            var transactions = _qifParser.Parse(model.File, model.AccountId, model.FromDate);
            var relatedTransactions = transactions.Where(t => t.RelatedTransactionId.HasValue);
            var unrelatedTransactions = transactions.Where(t => !t.RelatedTransactionId.HasValue);
            foreach (var trx in unrelatedTransactions)
            {
                _transactionRepo.Insert(trx);
            }
            var processed = new List<Guid>();
            foreach (var trx in relatedTransactions)
            {
                if (!processed.Contains(trx.TransactionId))
                {
                    var related = relatedTransactions.Single(t => t.TransactionId == trx.RelatedTransactionId.Value);
                    _transactionRepo.InsertRelatedTransaction(trx, related);
                    processed.Add(trx.TransactionId);
                    processed.Add(related.TransactionId);
                }
            }
            return CreatedAtAction("PostQif", new { id = model.AccountId }, transactions);
        }

        [HttpPost]
        public async Task<IActionResult> PostAccount([FromBody] AccountForPosting account)
        {
            var mappedAccount = _mapper.Map<Account>(account);
            mappedAccount.AccountId = Guid.NewGuid();
            _context.Accounts.Add(mappedAccount);

            var category = _context.GetOrCreateCategory("Starting Balance").GetAwaiter().GetResult();
            var transaction = new Transaction
            {
                TransactionId = Guid.NewGuid(),
                AccountId = mappedAccount.AccountId,
                Amount = account.StartingBalance,
                TransactionDate = account.StartDate,
                Vendor = "",
                Description = "",
                CategoryId = category.CategoryId,
                EnteredDate = account.StartDate,
                IsReconciled = true
            };
            _context.Transactions.Add(transaction);

            var model = new AccountWithTransactions
            {
                AccountId = mappedAccount.AccountId,
                Name = mappedAccount.Name,
                Transactions = new List<TransactionForDisplay>(new[] { _mapper.Map<TransactionForDisplay>(transaction) }),
                CurrentBalance = account.StartingBalance
            };
            await _context.SaveChangesAsync().ConfigureAwait(false);

            return CreatedAtAction("PostAccount", new { id = mappedAccount.AccountId }, model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount([FromRoute] Guid id)
        {
            var account = await _context.Accounts.FindAsync(id).ConfigureAwait(false);
            _context.Remove(account);
            await _context.SaveChangesAsync().ConfigureAwait(false);
            return Ok(account);
        }
    }
}
