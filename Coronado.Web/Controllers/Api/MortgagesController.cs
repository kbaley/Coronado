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
    public class MortgagesController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepo;
        private readonly IAccountRepository _accountRepo;
        private readonly ICategoryRepository _categoryRepo;

        public MortgagesController(ApplicationDbContext context, ITransactionRepository transactionRepo,
            IAccountRepository accountRepo, ICategoryRepository categoryRepo)
        {
            _transactionRepo = transactionRepo;
            _accountRepo = accountRepo;
            _categoryRepo = categoryRepo;
        }

        [HttpPost]
        public IActionResult PostMortgagePayment([FromBody] TransactionForDisplay transaction)
        {
            var principal = transaction.Debit.Value;
            var interest = transaction.Credit.Value;
            transaction.Credit = null;
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
                Description = string.IsNullOrWhiteSpace(transaction.Description) ? "Mortgage Payment" : transaction.Description,
                AccountId = transaction.RelatedAccountId.Value,
                Amount = 0 - transaction.Amount,
                EnteredDate = DateTime.Now,
                RelatedTransactionId = transaction.TransactionId
            };
            relatedTransaction.SetDebitAndCredit();

            transaction.RelatedTransactionId = relatedTransactionId;

            var mortgageInterestCategoryId = TransactionHelpers.GetOrCreateCategory("Mortgage Interest", _categoryRepo).CategoryId;
            var interestTransaction = new TransactionForDisplay {
                TransactionDate = transaction.TransactionDate,
                TransactionId = Guid.NewGuid(),
                Vendor = transaction.Vendor,
                AccountId = transaction.AccountId,
                Amount = 0 - interest,
                Debit = interest,
                EnteredDate = DateTime.Now,
                CategoryId = mortgageInterestCategoryId,
                CategoryDisplay = "Mortgage Interest"
            };

            var bankFeeTransactions = TransactionHelpers.GetBankFeeTransactions(transaction, _categoryRepo, _accountRepo);
            transactions.Add(transaction);
            transactions.Add(relatedTransaction);
            transactions.Add(interestTransaction);
            transactions.AddRange(bankFeeTransactions);
            _transactionRepo.InsertRelatedTransaction(transaction, relatedTransaction);
            _transactionRepo.Insert(interestTransaction);
            foreach(var trx in bankFeeTransactions) {
                _transactionRepo.Insert(trx);
            }

            return CreatedAtAction("PostTransfer", 
                new { id = transaction.TransactionId }, transactions);
        }
    }
}