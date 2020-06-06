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
                        var investmentTransactions = _context.InvestmentTransactions
                            .Where(t => t.TransactionId == dbTransaction.TransactionId).ToList();
                        foreach (var item in investmentTransactions)
                        {
                            _context.InvestmentTransactions.Remove(item); 
                        }
                        DeleteTransfersFor(dbTransaction);
                        
                        break;
                }
                switch (transaction.TransactionType)
                {
                    case TRANSACTION_TYPE.REGULAR:
                        // Nothing to correct
                        break;
                    case TRANSACTION_TYPE.TRANSFER:
                        // Add transfer and related transaction
                        CreateTransferFrom(transaction, dbTransaction.TransactionId, GetCadExchangeRate());
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

        private decimal GetCadExchangeRate() {
            var currency = _context.Currencies.SingleOrDefault(c => c.Symbol == "CAD");
            if (currency == null) return 1.0m;
            return currency.PriceInUsd;
        }

        public IEnumerable<Transaction> Insert(TransactionForDisplay transactionDto)
        {
            var cadExchangeRate = GetCadExchangeRate();
            var transactionList = new List<Transaction>();
            var transaction = transactionDto.ShallowMap();
            transaction.Category = _context.Categories.Find(transaction.CategoryId);
            var exchangeRate = 1.0m;
            if (GetCurrencyFor(transaction.AccountId) == "CAD") {
                exchangeRate = cadExchangeRate;
            };
            transaction.AmountInBaseCurrency = Math.Round(transaction.Amount / exchangeRate, 2);
            transactionList.Add(transaction);
            _context.Transactions.Add(transaction);
            var bankFeeTransactions = GetBankFeeTransactions(transactionDto);
            foreach (var trx in bankFeeTransactions)
            {
                trx.AmountInBaseCurrency = Math.Round(trx.Amount / exchangeRate, 2);
                _context.Transactions.Add(trx);    
            }
            transactionList.AddRange(bankFeeTransactions);
            UpdateInvoiceBalance(transaction.InvoiceId);
            AddOrUpdateVendor(transactionDto.Vendor, transactionDto.CategoryId);
            if (transactionDto.TransactionType == TRANSACTION_TYPE.TRANSFER)
            {
                CreateTransferFrom(transactionDto, transaction.TransactionId, cadExchangeRate);
            }
            _context.SaveChanges();
            return transactionList;
        }

        private string GetCurrencyFor(Guid accountId)
        {
            return _context.Accounts.Find(accountId).Currency;
        }

        private void CreateTransferFrom(TransactionForDisplay transactionDto, Guid relatedTransactionId, decimal cadExchangeRate)
        {
            var rightTransaction = transactionDto.ShallowMap();
            rightTransaction.TransactionId = Guid.NewGuid();
            rightTransaction.AccountId = transactionDto.RelatedAccountId.Value;
            rightTransaction.Amount = 0 - transactionDto.Amount;
            rightTransaction.AmountInBaseCurrency = rightTransaction.Amount;
            if (GetCurrencyFor(rightTransaction.AccountId) == "CAD") {
                rightTransaction.AmountInBaseCurrency = Math.Round(rightTransaction.Amount / cadExchangeRate, 2);
            }
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
            var transactionList = _context.Transactions
                .Include(t => t.LeftTransfer)
                .Include(t => t.LeftTransfer.RightTransaction)
                .Include(t => t.LeftTransfer.RightTransaction.Account)
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.EnteredDate)
                .ThenBy(t => t.TransactionId)
                .Skip(PAGE_SIZE * thePage).Take(PAGE_SIZE)
                .ToList();
            var transactions = transactionList
                .Select(t => _mapper.Map<TransactionForDisplay>(t))
                .ToList();

            var remainingTransactionCount = _context.Transactions
                .Count(t => t.AccountId == accountId) - transactions.Count();
            var startingBalance = _context.Transactions
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.EnteredDate)
                .ThenBy(t => t.TransactionId)
                .Skip(transactionList.Count())
                .Sum(t => t.Amount);
            transactions.ForEach(t => t.SetDebitAndCredit());

            var model = new TransactionListModel
            {
                Transactions = transactions,
                StartingBalance = startingBalance,
                RemainingTransactionCount = remainingTransactionCount,
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
                .OrderByDescending(t => t.TransactionDate)
                .ThenByDescending(t => t.EnteredDate)
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
                .Sum(t => t.AmountInBaseCurrency);
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
                var sql = "SELECT t.category_id, c.name, " + amountPrefix + "sum(amount_in_base_currency) as amount, EXTRACT(MONTH from t.transaction_date)::int as month, EXTRACT(YEAR from t.transaction_date)::int as year FROM transactions t " +
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

        public async Task<IEnumerable<dynamic>> GetMonthlyTotalsForCategory(Guid categoryId, DateTime start, DateTime end)
        {
            using (var conn = Connection)
            {
                var sql = @"SELECT sum(amount_in_base_currency) as amount, EXTRACT(MONTH from t.transaction_date)::int as month, EXTRACT(YEAR from t.transaction_date)::int as year FROM transactions t
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

        private IEnumerable<Transaction> GetBankFeeTransactions(TransactionForDisplay newTransaction)
        {
            var transactions = new List<Transaction>();
            var description = newTransaction.Description;
            if (!description.Contains("bf:", StringComparison.CurrentCultureIgnoreCase)) {
                return transactions;
            }

            var category = _context.GetOrCreateCategory("Bank Fees").GetAwaiter().GetResult();
            var vendor = _context.Accounts.Find(newTransaction.AccountId.Value).Vendor;
                newTransaction.Description = description.Substring(0, description.IndexOf("bf:", StringComparison.CurrentCultureIgnoreCase));
                var parsed = description.Substring(description.IndexOf("bf:", 0, StringComparison.CurrentCultureIgnoreCase));
                while (parsed.StartsWith("bf:", StringComparison.CurrentCultureIgnoreCase)) {
                    var next = parsed.IndexOf("bf:", 1, StringComparison.CurrentCultureIgnoreCase);
                    if (next == -1) next = parsed.Length;
                    var transactionData = parsed.Substring(3, next - 3).Trim().Split(" ");
                    decimal amount;
                    if (decimal.TryParse(transactionData[0], out amount)) {
                        var bankFeeDescription = string.Join(" ", transactionData.Skip(1).ToArray());
                        var transaction = new Transaction {
                            TransactionId = Guid.NewGuid(),
                            TransactionDate = newTransaction.TransactionDate,
                            AccountId = newTransaction.AccountId.Value,
                            CategoryId = category.CategoryId,
                            Category = category,
                            Description = bankFeeDescription,
                            Vendor = vendor,
                            Amount = 0 - amount,
                            EnteredDate = newTransaction.EnteredDate
                        };
                        transactions.Add(transaction);
                    }
                    parsed = parsed.Substring(next);
                } 
            return transactions;
        }

    }
}
