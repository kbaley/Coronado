using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Controllers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransfersController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly ITransactionRepository _transactionRepo;
        private readonly IAccountRepository _accountRepo;

        public TransfersController(CoronadoDbContext context, ITransactionRepository transactionRepo,
            IAccountRepository accountRepo)
        {
            _context = context;
            _transactionRepo = transactionRepo;
            _accountRepo = accountRepo;
        }

        [HttpPost]
        public IActionResult PostTransfer([FromBody] TransactionForDisplay transaction)
        {
            var transactions = new List<TransactionForDisplay>();
            if (transaction.TransactionId == null || transaction.TransactionId == Guid.Empty) transaction.TransactionId = Guid.NewGuid();
            if (!transaction.AccountId.HasValue) {
                transaction.AccountId = _accountRepo.GetAll().Single(
                        a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase)).AccountId;
            }
            transaction.SetAmount();
            var relatedTransactionId = Guid.NewGuid();
            var relatedTransaction = new TransactionForDisplay {
                TransactionDate = transaction.TransactionDate,
                TransactionId = relatedTransactionId,
                Vendor = transaction.Vendor,
                Description = transaction.Description,
                AccountId = transaction.RelatedAccountId.Value,
                Amount = 0 - transaction.Amount,
                EnteredDate = DateTime.Now,
                RelatedTransactionId = transaction.TransactionId
            };
            relatedTransaction.SetDebitAndCredit();

            transaction.RelatedTransactionId = relatedTransactionId;

            var bankFeeTransactions = TransactionHelpers.GetBankFeeTransactions(transaction, _accountRepo, _context);
            transactions.Add(transaction);
            transactions.Add(relatedTransaction);
            transactions.AddRange(bankFeeTransactions);
            _transactionRepo.InsertRelatedTransaction(transaction, relatedTransaction);
            foreach(var trx in bankFeeTransactions) {
                _transactionRepo.Insert(trx);
            }

            var accountBalances = _accountRepo.GetAccountBalances().Select(a => new {a.AccountId, a.CurrentBalance});
            return CreatedAtAction("PostTransfer", 
                new { id = transaction.TransactionId }, new {transactions, accountBalances});
        }
    }
}
