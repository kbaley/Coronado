using System;
using System.Collections.Generic;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Models;
using Coronado.Web.Controllers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using System.Threading.Tasks;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly ITransactionRepository _transactionRepo;
        private readonly IMapper _mapper;

        public TransactionsController(CoronadoDbContext context, ITransactionRepository transactionRepo,
            IMapper mapper)
        {
            _context = context;
            _transactionRepo = transactionRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public TransactionListModel GetTransactions([FromQuery] UrlQuery query)
        {
            if (query.LoadAll) {
                var transactions = _transactionRepo.GetByAccount(query.AccountId);
                return new TransactionListModel {
                    Transactions = transactions,
                    StartingBalance = 0,
                    RemainingTransactionCount = 0
                };
            }
            return _transactionRepo.GetByAccount(query.AccountId, query.Page);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTransaction([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var transaction = _transactionRepo.Get(id);
            InvoiceForPosting invoiceDto = null;
            if (transaction.InvoiceId.HasValue)
            {
                var invoice = _context.Invoices.Find(transaction.InvoiceId.Value);
                _context.Entry(invoice).Collection(i => i.LineItems).Load();
                _context.Entry(invoice).Reference(i => i.Customer).Load();
                invoiceDto = _mapper.Map<InvoiceForPosting>(invoice);
            }
            _transactionRepo.Delete(id);

            return Ok(new { transaction, accountBalances = _context.Accounts.GetAccountBalances().ToList(), invoiceDto });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTransaction([FromRoute] Guid id,
                [FromBody] TransactionForDisplay transaction)
        {

            if (id != transaction.TransactionId)
            {
                return BadRequest();
            }

            var originalAmount = _transactionRepo.Get(transaction.TransactionId).Amount;
            transaction.SetAmount();
            _transactionRepo.Update(transaction);
            InvoiceForPosting invoiceDto = null;
            if (transaction.InvoiceId.HasValue)
            {
                var invoice = _context.FindInvoiceEager(transaction.InvoiceId.Value);
                invoiceDto = _mapper.Map<InvoiceForPosting>(invoice);
            }
            return Ok(new { transaction, 
                originalAmount, 
                accountBalances = _context.Accounts.GetAccountBalances().ToList(), 
                invoiceDto 
            });
        }

        [HttpPost]
        public async Task<IActionResult> PostTransaction([FromBody] TransactionForDisplay transaction)
        {
            var transactions = new List<TransactionForDisplay>();
            if (transaction.TransactionId == null || transaction.TransactionId == Guid.Empty) transaction.TransactionId = Guid.NewGuid();
            if (transaction.AccountId == null)
            {
                transaction.AccountId = _context.Accounts.Single(a => a.Name.Equals(transaction.AccountName, StringComparison.CurrentCultureIgnoreCase)).AccountId;
            }
            transaction.SetAmount();
            transaction.EnteredDate = DateTime.Now;
            if (transaction.CategoryId.IsNullOrEmpty() && !string.IsNullOrWhiteSpace(transaction.CategoryName))
            {
                transaction.CategoryId = _context.GetOrCreateCategory(transaction.CategoryName).GetAwaiter().GetResult().CategoryId;
            }

            var addedTransactions = _transactionRepo.Insert(transaction);
            transactions.AddRange(addedTransactions.Select(t => _mapper.Map<TransactionForDisplay>(t)));
            transactions.ForEach(t => t.SetDebitAndCredit());

            var accountBalances = _context.Accounts.GetAccountBalances().ToList();
            InvoiceForPosting invoiceDto = null;
            if (transaction.InvoiceId.HasValue)
            {
                var invoice = await _context.FindInvoiceEager(transaction.InvoiceId.Value).ConfigureAwait(false);
                invoiceDto = _mapper.Map<InvoiceForPosting>(invoice);
            }
            var vendor = _context.Vendors.SingleOrDefault(v => v.Name == transaction.Vendor);

            return CreatedAtAction("PostTransaction", new { id = transaction.TransactionId }, new { transactions, accountBalances, invoiceDto, vendor });
        }

    }
}
