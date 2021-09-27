using System;
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
        private readonly ITransactionRepository _transactionRepo;
        private readonly IMapper _mapper;
        private readonly TransactionParser _transactionParser;

        public AccountsController(CoronadoDbContext context,
            ITransactionRepository transactionRepo, IMapper mapper)
        {
            _context = context;
            _transactionRepo = transactionRepo;
            _mapper = mapper;
            _transactionParser = new TransactionParser(context);
        }

        // GET: api/Accounts
        [HttpGet]
        public IEnumerable<AccountWithBalance> GetAccounts()
        {
            var exchangeRate = _context.Currencies.GetCadExchangeRate();
            var accounts = _context.Accounts
                .Select(a => new AccountWithBalance
                {
                    AccountId = a.AccountId,
                    Name = a.Name,
                    Currency = a.Currency,
                    Vendor = a.Currency,
                    AccountType = a.AccountType,
                    MortgagePayment = a.MortgagePayment,
                    MortgageType = a.MortgageType,
                    DisplayOrder = a.DisplayOrder,
                    IsHidden = a.IsHidden,
                    CurrentBalance = a.Transactions.Sum(t => t.Amount),
                    CurrentBalanceInUsd = a.Currency == "CAD" 
                        ? Math.Round(a.Transactions.Sum(t => t.Amount) / exchangeRate, 2)
                        : a.Transactions.Sum(t => t.Amount),
                });
            return accounts;
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
            IEnumerable<TransactionForDisplay> transactions;
            if (model.File != null)
            {
                transactions = _transactionParser.Parse(model.File, model.AccountId, model.FromDate);
            }
            else
            {
                transactions = _transactionParser.Parse(model.Transactions, model.AccountId, model.FromDate);
            }
            var insertedTransactions = new List<TransactionForDisplay>();
            foreach (var trx in transactions)
            {
                if (string.IsNullOrWhiteSpace(trx.DownloadId))
                {
                    _transactionRepo.Insert(trx);
                    insertedTransactions.Add(trx);
                }
                else
                {
                    var existingTrx = _context.Transactions.Any(t => t.DownloadId == trx.DownloadId);
                    if (!existingTrx) {
                        _transactionRepo.Insert(trx);
                        insertedTransactions.Add(trx);
                    }
                }
            }
            return CreatedAtAction("PostQif", new { id = model.AccountId }, insertedTransactions);
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
                AmountInBaseCurrency = account.StartingBalance,
                TransactionDate = account.StartDate,
                Vendor = "",
                Description = "",
                CategoryId = category.CategoryId,
                EnteredDate = account.StartDate,
                IsReconciled = true
            };
            var exchangeRate = _context.Currencies.GetCadExchangeRate();
            var accountCurrency = account.Currency;
            transaction.SetAmountInBaseCurrency(accountCurrency, exchangeRate);
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
