using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

namespace Coronado.Web.Models
{

    public class AccountForPosting
    {
        public Guid AccountId { get; set; }
        public string Name { get; set; }
        public decimal StartingBalance { get; set; }
        public DateTime StartDate { get; set; }
        public string Currency { get; set; }
        public string Vendor { get; set; }
        public string AccountType { get; set; }
    }

    public class AccountWithTransactions
    {
        public string Name { get; set; }
        public Guid AccountId { get; set; }
        public decimal CurrentBalance { get; set; }
        public IEnumerable<TransactionForDisplay> Transactions { get; set; }
    }

    public class AccountTransaction
    {
        public Guid TransactionId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public Guid? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public decimal Amount { get; set; }
        public decimal RunningTotal { get; set; }

        public static AccountTransaction FromTransaction(TransactionForDisplay t)
        {
            return new AccountTransaction
            {
                TransactionId = t.TransactionId,
                Vendor = t.Vendor,
                Description = t.Description,
                TransactionDate = t.TransactionDate,
                Amount = t.Amount,
                CategoryId = t.CategoryId,
                CategoryName = t.CategoryName,
            };
        }
    }
}