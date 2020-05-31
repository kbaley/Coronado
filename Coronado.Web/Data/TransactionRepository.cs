using System;
using System.Collections.Generic;
using Coronado.Web.Controllers.Dtos;
using Coronado.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Coronado.Web.Domain;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;

namespace Coronado.Web.Data
{
    public class TransactionRepository : BaseRepository, ITransactionRepository
    {
        private const int PAGE_SIZE = 100;
        private readonly CoronadoDbContext _context;
        private readonly IMapper _mapper;

        public TransactionRepository(IConfiguration config, CoronadoDbContext context, IMapper mapper) : base(config)
        {
            _context = context;
            _mapper = mapper;
        }

        private void UpdateInvoiceBalance(Guid? invoiceId, Guid? transactionId = null)
        {
            if (!invoiceId.HasValue) return;
            Func<Transaction, bool> Matches = (transaction) =>
            {
                if (transactionId.HasValue)
                {
                    return transaction.InvoiceId == invoiceId.Value && transaction.TransactionId != transactionId.Value;
                }
                return transaction.InvoiceId == invoiceId.Value;
            };

            var invoice = _context.Invoices
                .Include(i => i.LineItems)
                .Single(i => i.InvoiceId == invoiceId.Value);
            var payments = _context.Transactions
                .Where(Matches)
                .Sum(t => t.Amount);
            invoice.Balance = invoice.LineItems.Sum(li => li.Amount) - payments;
            _context.Invoices.Update(invoice);
        }

        private void DeleteTransfersFor(Transaction transaction) {
            if (transaction.LeftTransfer != null) {
                _context.Transactions.Remove(transaction.LeftTransfer.RightTransaction);
                _context.Transfers.Remove(transaction.LeftTransfer);
                _context.Transfers.Remove(transaction.RightTransfer);
            }
        }

        public void Delete(Guid transactionId)
        {
            var transaction = _context.Transactions
                .Include(t => t.LeftTransfer)
                .Include(t => t.RightTransfer)
                .Include(t => t.LeftTransfer.RightTransaction)
                .Single(t => t.TransactionId == transactionId);
            UpdateInvoiceBalance(transaction.InvoiceId, transactionId);
            _context.Transactions.Remove(transaction);
            if (transaction.LeftTransfer != null) {
                _context.Transactions.Remove(transaction.LeftTransfer.RightTransaction);
                _context.Transfers.Remove(transaction.LeftTransfer);
                _context.Transfers.Remove(transaction.RightTransfer);
            }
            _context.SaveChanges();
        }

        public Transaction Update(TransactionForDisplay transaction)
        {
            var dbTransaction = _context.Transactions
                .Include(t => t.LeftTransfer)
                .Include(t => t.Category)
                .Include(t => t.LeftTransfer.RightTransaction)
                .Include(t => t.RightTransfer)
                .Single(t => t.TransactionId == transaction.TransactionId);
            var oldTransactionType = dbTransaction.TransactionType;
            dbTransaction.AccountId = transaction.AccountId.Value;
            dbTransaction.Vendor = transaction.Vendor;
            dbTransaction.Description = transaction.Description;
            dbTransaction.IsReconciled = transaction.IsReconciled;
            dbTransaction.InvoiceId = transaction.InvoiceId;
            dbTransaction.TransactionDate = transaction.TransactionDate;
            dbTransaction.CategoryId = transaction.CategoryId;
            dbTransaction.Amount = transaction.Amount;
            if (oldTransactionType != transaction.TransactionType)
            {
                // Hoo-boy, here we go...

                switch (oldTransactionType)
                {
                    case TRANSACTION_TYPE.REGULAR:
                        // Nothing to correct
                        break;
                    case TRANSACTION_TYPE.TRANSFER:
                        // Delete transfer and related transaction
                        DeleteTransfersFor(dbTransaction);
                        break;
                    case TRANSACTION_TYPE.INVOICE_PAYMENT:
                        // Nothing to do for now
                        break;
                    case TRANSACTION_TYPE.INVESTMENT:
                        // Delete investment transaction, transfer, and related transaction
                        break;
                }
                switch (transaction.TransactionType)
                {
                    case TRANSACTION_TYPE.REGULAR:
                        // Nothing to correct
                        break;
                    case TRANSACTION_TYPE.TRANSFER:
                        // Add transfer and related transaction
                        CreateTransferFrom(transaction, dbTransaction.TransactionId);
                        break;
                    case TRANSACTION_TYPE.INVOICE_PAYMENT:
                        // Nothing to do for now
                        break;
                    case TRANSACTION_TYPE.INVESTMENT:
                        // Nothing to do; it's not possible to change a transaction to an investment one in the UI
                        break;
                }

            }

            _context.Transactions.Update(dbTransaction);
            UpdateInvoiceBalance(transaction.InvoiceId);
            AddOrUpdateVendor(transaction.Vendor, transaction.CategoryId);
            _context.SaveChanges();
            return dbTransaction;
        }

        private void AddOrUpdateVendor(string vendorName, Guid? categoryId)
        {
            if (!categoryId.HasValue) return;
            if (string.IsNullOrWhiteSpace(vendorName)) return;
            var vendor = _context.Vendors.SingleOrDefault(v => v.Name.ToLower() == vendorName.ToLower());
            if (vendor == null)
            {
                vendor = new Vendor
                {
                    VendorId = Guid.NewGuid(),
                    Name = vendorName,
                    LastTransactionCategoryId = categoryId.Value
                };
                _context.Vendors.Add(vendor);
            }
            else
            {
                vendor.LastTransactionCategoryId = categoryId.Value;
            }
        }

        public void Insert(TransactionForDisplay transactionDto)
        {
            var transaction = transactionDto.ShallowMap();
            _context.Transactions.Add(transaction);
            UpdateInvoiceBalance(transaction.InvoiceId);
            AddOrUpdateVendor(transactionDto.Vendor, transactionDto.CategoryId);
            if (transactionDto.TransactionType == TRANSACTION_TYPE.TRANSFER)
            {
                CreateTransferFrom(transactionDto, transaction.TransactionId);
            }
            _context.SaveChanges();
        }

        private void CreateTransferFrom(TransactionForDisplay transactionDto, Guid relatedTransactionId)
        {
            var rightTransaction = transactionDto.ShallowMap();
            rightTransaction.TransactionId = Guid.NewGuid();
            rightTransaction.AccountId = transactionDto.RelatedAccountId.Value;
            rightTransaction.Amount = 0 - transactionDto.Amount;
            _context.Transactions.Add(rightTransaction);
            _context.Transfers.Add(new Transfer
            {
                TransferId = Guid.NewGuid(),
                LeftTransactionId = relatedTransactionId,
                RightTransactionId = rightTransaction.TransactionId
            });
            _context.Transfers.Add(new Transfer
            {
                TransferId = Guid.NewGuid(),
                RightTransactionId = relatedTransactionId,
                LeftTransactionId = rightTransaction.TransactionId
            });
        }

        public TransactionListModel GetByAccount(Guid accountId, int? page)
        {
            var thePage = page ?? 0;
            var allTransactions = GetByAccount(accountId)
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.EnteredDate);

            var transactions = allTransactions
                .Skip(PAGE_SIZE * thePage).Take(PAGE_SIZE);
            var restOfTransactions = allTransactions
                .Skip(PAGE_SIZE * (thePage + 1));
            var startingBalance = restOfTransactions.Sum(t => t.Amount);
            var model = new TransactionListModel
            {
                Transactions = transactions,
                StartingBalance = startingBalance,
                RemainingTransactionCount = restOfTransactions.Count(),
                Page = thePage
            };
            return model;
        }

        public IEnumerable<TransactionForDisplay> GetByAccount(Guid accountId)
        {
            var transactions = _context.Transactions
                .Include(t => t.LeftTransfer)
                .Include(t => t.LeftTransfer.RightTransaction)
                .Include(t => t.LeftTransfer.RightTransaction.Account)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Where(t => t.AccountId == accountId)
                .Select(t => _mapper.Map<TransactionForDisplay>(t))
                .ToList();
            transactions.ForEach(t => t.SetDebitAndCredit());
            return transactions;
        }

        public TransactionForDisplay Get(Guid transactionId)
        {
            var transaction = _context.Transactions
                .Include(t => t.LeftTransfer)
                .Include(t => t.LeftTransfer.RightTransaction)
                .Include(t => t.LeftTransfer.RightTransaction.Account)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .SingleOrDefault(t => t.TransactionId == transactionId);
            var mapped = _mapper.Map<TransactionForDisplay>(transaction);
            mapped.SetDebitAndCredit();
            return mapped;
        }

        public decimal GetNetWorthFor(DateTime date)
        {
            return _context.Transactions
                .Where(t => t.TransactionDate <= date)
                .Sum(t => t.Amount);
        }

        public IEnumerable<CategoryTotal> GetTransactionsByCategoryType(string categoryType, DateTime start, DateTime end)
        {
            var amountPrefix = "";
            if (categoryType == "Expense")
            {
                amountPrefix = "0 - ";
            }
            using (var conn = Connection)
            {
                var sql = "SELECT t.category_id, c.name, " + amountPrefix + "sum(amount) as amount, EXTRACT(MONTH from t.transaction_date)::int as month, EXTRACT(YEAR from t.transaction_date)::int as year FROM transactions t " +
                    "INNER JOIN categories c ON t.category_id = c.category_id " +
                    "WHERE transaction_date > @start and transaction_date <= @end " +
                    "AND c.Type = '" + categoryType + "' " +
                    "GROUP BY t.category_id, c.name, EXTRACT(MONTH from t.transaction_date), EXTRACT(YEAR from t.transaction_date)";
                var data = conn.Query(sql, new { start, end });

                var results = data.GroupBy(x => x.category_id)
                                .Select(x => new CategoryTotal
                                {
                                    CategoryId = x.Key,
                                    CategoryName = x.First().name,
                                    Amounts = x.Select(e => new DateAndAmount(e.year, e.month, e.amount)).ToList()
                                });

                return results;
            }
        }

        public IEnumerable<CategoryTotal> GetInvoiceLineItemsIncomeTotals(DateTime start, DateTime end)
        {
            using (var conn = Connection)
            {
                var sql = @"
                    SELECT ili.category_id, c.name, sum(ili.quantity * ili.unit_amount) as amount, EXTRACT(MONTH from i.date)::int as month, 
                    EXTRACT(YEAR from i.date)::int as year 
                    FROM invoice_line_items ili
                    INNER JOIN categories c ON ili.category_id = c.category_id
                    INNER JOIN invoices i
                    ON ili.invoice_id = i.invoice_id
                    WHERE i.date > @start and i.date <= @end
                    AND c.Type = 'Income'
                    GROUP BY ili.category_id, c.name, EXTRACT(MONTH from i.date), EXTRACT(YEAR from i.date)";
                var data = conn.Query(sql, new { start, end });

                var results = data.GroupBy(x => x.category_id)
                                .Select(x => new CategoryTotal
                                {
                                    CategoryId = x.Key,
                                    CategoryName = x.First().name,
                                    Amounts = x.Select(e => new DateAndAmount(e.year, e.month, e.amount)).ToList()
                                });

                return results;
            }
        }

        public void InsertRelatedTransaction(TransactionForDisplay first, TransactionForDisplay second)
        {
            first.RelatedTransactionId = null;
            Insert(first);
            Insert(second);
            first.RelatedTransactionId = second.TransactionId;
            Update(first);
        }

        public async Task<IEnumerable<dynamic>> GetMonthlyTotalsForCategory(Guid categoryId, DateTime start, DateTime end)
        {
            using (var conn = Connection)
            {
                var sql = @"SELECT sum(amount) as amount, EXTRACT(MONTH from t.transaction_date)::int as month, EXTRACT(YEAR from t.transaction_date)::int as year FROM transactions t
                    WHERE transaction_date > @start and transaction_date <= @end
                    AND t.category_id = @categoryId
                    GROUP BY EXTRACT(MONTH from t.transaction_date), EXTRACT(YEAR from t.transaction_date)";
                var data = await conn.QueryAsync(sql, new { start, end, categoryId }).ConfigureAwait(false);
                var results = data.Select(e => new
                {
                    date = new DateTime(e.year, e.month, 1),
                    e.amount
                }).OrderByDescending(r => r.date);

                return results;
            }
        }
    }
}
