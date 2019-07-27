using System;
using System.Collections.Generic;
using Coronado.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Npgsql;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public class TransactionRepository : BaseRepository, ITransactionRepository
    {
        public TransactionRepository(IConfiguration config) : base(config) { }

        public void Delete(Guid transactionId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var trx = conn.BeginTransaction())
                {
                    try
                    {
                        // Check for a related transaction
                        var transaction = conn.QuerySingle<TransactionForDisplay>(
                @"SELECT invoice_id, related_transaction_id, amount
    FROM transactions
    WHERE transaction_id = @TransactionId", new { transactionId });
                        var relatedTransactionId = transaction.RelatedTransactionId;
                        if (relatedTransactionId != null && relatedTransactionId != Guid.Empty)
                        {
                            // Related transaction exists; delete it first (after clearing the FK relationship)
                            conn.Execute("UPDATE transactions SET related_transaction_id = null WHERE transaction_id = @TransactionId",
                                new { transactionId }, trx);
                            conn.Execute("DELETE FROM transactions WHERE related_transaction_id = @TransactionId",
                                new { transactionId }, trx);
                        }
                        conn.Execute("DELETE FROM transactions WHERE transaction_id = @TransactionId", new { transactionId }, trx);
                        if (transaction.InvoiceId.HasValue)
                        {
                            // Isolation level doesn't allow use of `UpdateInvoice`
                            // conn.Execute("UPDATE invoices SET balance = balance + @Amount WHERE invoice_id = @InvoiceId",
                            //   new { Amount = transaction.Amount, InvoiceId = transaction.InvoiceId.Value}, trx);
                            UpdateInvoice(transaction.InvoiceId.Value, conn, trx);
                        }
                        trx.Commit();
                    }
                    catch
                    {
                        trx.Rollback();
                        throw;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
        }

        public void Update(TransactionForDisplay transaction)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var trx = conn.BeginTransaction())
                {
                    try
                    {
                        conn.Execute(
                            @"UPDATE transactions
                SET account_id = @AccountId, vendor = @Vendor, description = @Description, is_reconciled = @IsReconciled, 
                transaction_date = @TransactionDate, category_id = @CategoryId, amount = @Amount, 
                related_transaction_id = @RelatedTransactionId, invoice_id = @InvoiceId
                WHERE transaction_id = @TransactionId", transaction);
                        if (transaction.InvoiceId.HasValue)
                        {
                            UpdateInvoice(transaction.InvoiceId.Value, conn, trx);
                        }
                        if (transaction.CategoryId.HasValue)
                        {
                            UpdateVendor(transaction.Vendor, transaction.CategoryId.Value, conn, trx);
                        }
                        trx.Commit();
                    }
                    catch
                    {
                        trx.Rollback();
                    }
                    finally
                    {
                        conn.Close();
                    }

                }
            }
        }

        private void UpdateInvoice(Guid invoiceId, IDbConnection conn, IDbTransaction trx)
        {
            conn.Execute(
                @"UPDATE invoices
            SET balance = (SELECT SUM(line_items) FROM (
                SELECT quantity * unit_amount as line_items FROM invoice_line_items
                WHERE invoice_id = @InvoiceId
                UNION
                SELECT SUM(-amount) FROM transactions WHERE invoice_id = @InvoiceId) items)
            WHERE invoice_id = @InvoiceId",
                new { InvoiceId = invoiceId }, trx);
        }

        private void UpdateVendor(string vendorName, Guid categoryId, IDbConnection conn, IDbTransaction trx)
        {
            if (string.IsNullOrWhiteSpace(vendorName)) return;
            var vendor = conn.QuerySingleOrDefault<Vendor>("SELECT * from vendors WHERE name=@vendorName", new { vendorName }, trx);
            if (vendor == null)
            {
                conn.Execute(@"INSERT INTO vendors (vendor_id, name, last_transaction_category_id)
          VALUES (@VendorId, @VendorName, @CategoryId)", new { VendorId = Guid.NewGuid(), vendorName, categoryId }, trx);
            }
            else
            {
                conn.Execute(@"UPDATE vendors
          SET last_transaction_category_id = @categoryId
          WHERE vendor_id = @VendorId", new { VendorId = vendor.VendorId, categoryId }, trx);
            }
        }

        public void Insert(IEnumerable<TransactionForDisplay> transactions)
        {

            using (var conn = Connection)
            {
                conn.Open();
                using (var trx = conn.BeginTransaction())
                {
                    try
                    {
                        foreach (var transaction in transactions)
                        {
                            conn.Execute(
                            @"INSERT INTO transactions (transaction_id, account_id, vendor, description, is_reconciled, transaction_date, category_id,
                    entered_date, amount, related_transaction_id, invoice_id)
                    VALUES (@TransactionId, @AccountId, @Vendor, @Description, @IsReconciled, @TransactionDate, @CategoryId,
                    @EnteredDate, @Amount, @RelatedTransactionId, @InvoiceId)
                ", transaction, trx);
                            if (transaction.InvoiceId.HasValue)
                            {
                                UpdateInvoice(transaction.InvoiceId.Value, conn, trx);
                            }
                            if (transaction.CategoryId.HasValue)
                            {
                                UpdateVendor(transaction.Vendor, transaction.CategoryId.Value, conn, trx);
                            }
                        }
                        trx.Commit();
                    }
                    catch
                    {
                        trx.Rollback();
                        throw;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
        }

        public void Insert(TransactionForDisplay transaction)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var trx = conn.BeginTransaction())
                {
                    try
                    {
                        conn.Execute(
                        @"INSERT INTO transactions (transaction_id, account_id, vendor, description, is_reconciled, transaction_date, category_id,
                    entered_date, amount, related_transaction_id, invoice_id)
                    VALUES (@TransactionId, @AccountId, @Vendor, @Description, @IsReconciled, @TransactionDate, @CategoryId,
                    @EnteredDate, @Amount, @RelatedTransactionId, @InvoiceId)
                ", transaction, trx);
                        if (transaction.InvoiceId.HasValue)
                        {
                            UpdateInvoice(transaction.InvoiceId.Value, conn, trx);
                        }
                        if (transaction.CategoryId.HasValue)
                        {
                            UpdateVendor(transaction.Vendor, transaction.CategoryId.Value, conn, trx);
                        }
                        trx.Commit();
                    }
                    catch
                    {
                        trx.Rollback();
                        throw;
                    }
                    finally
                    {
                        conn.Close();
                    }
                }
            }
        }
        public IEnumerable<TransactionForDisplay> GetByAccount(Guid accountId)
        {
            using (IDbConnection dbConnection = Connection)
            {
                var transactions = dbConnection.Query<TransactionForDisplay>(
        @"SELECT t.*, a.name as AccountName, c.name as CategoryName, a1.account_id as RelatedAccountId, a1.name as RelatedAccountName,
    i.invoice_number
FROM transactions t
LEFT JOIN accounts a
ON t.account_id = a.account_id
LEFT JOIN categories c
ON t.category_id = c.category_id
LEFT JOIN transactions t1
ON t.related_transaction_id = t1.transaction_id
LEFT JOIN accounts a1
ON t1.account_id = a1.account_id
LEFT JOIN invoices i
ON t.invoice_id = i.invoice_id
WHERE t.account_id=@AccountId;", new { AccountId = accountId });
                foreach (var transaction in transactions)
                {
                    transaction.SetDebitAndCredit();
                    if (transaction.RelatedTransactionId.HasValue)
                    {
                        transaction.CategoryDisplay = "TRANSFER: " + transaction.RelatedAccountName;
                    }
                    else if (transaction.InvoiceId.HasValue)
                    {
                        transaction.CategoryDisplay = "PAYMENT: " + transaction.InvoiceNumber;
                    }
                    else
                    {
                        transaction.CategoryDisplay = transaction.CategoryName;
                    }
                }
                return transactions;
            }
        }

        public TransactionForDisplay Get(Guid transactionId)
        {
            using (IDbConnection dbConnection = Connection)
            {
                var transaction = dbConnection.QuerySingle<TransactionForDisplay>(
        @"SELECT t.*, a.name as AccountName, c.name as CategoryName, a1.account_id as RelatedAccountId, a1.name as RelatedAccountName
FROM transactions t
LEFT JOIN accounts a
ON t.account_id = a.account_id
LEFT JOIN categories c
ON t.category_id = c.category_id
LEFT JOIN transactions t1
ON t.related_transaction_id = t1.transaction_id
LEFT JOIN accounts a1
ON t1.account_id = a1.account_id
WHERE t.transaction_id=@transactionId;", new { transactionId });
                transaction.SetDebitAndCredit();
                if (transaction.RelatedTransactionId.HasValue)
                {
                    transaction.CategoryDisplay = "TRF: " + transaction.RelatedAccountName;
                }
                else
                {
                    transaction.CategoryDisplay = transaction.CategoryName;
                }
                return transaction;
            }
        }

        public decimal GetNetWorthFor(DateTime date)
        {
            using (var conn = Connection)
            {
                return conn.ExecuteScalar<decimal>("SELECT SUM(amount) FROM transactions WHERE transaction_date <= @date", new { date });
            }
        }

        public IEnumerable<dynamic> GetExpensesByCategory(DateTime start, DateTime end) 
        {
            using (var conn = Connection)
            {
                var sql = "SELECT t.category_id, c.name, 0 - sum(amount) as amount FROM transactions t " +
                    "INNER JOIN categories c ON t.category_id = c.category_id " +
                    "WHERE transaction_date > @start and transaction_date <= @end " +
                    "AND c.Type = 'Expense' " +
                    "GROUP BY t.category_id, c.name";
                return conn.Query(sql, new { start, end });
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
    }
}
