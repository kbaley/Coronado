using System;
using System.Collections.Generic;

namespace Coronado.ConsoleApp.Domain
{
    public class Transaction : IHasAlias {
        public Guid TransactionId { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Vendor { get; set; }
        public Guid? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategoryDisplay { get; set; }
        public decimal Amount { get; set; }
        public DateTime EnteredDate { get; set; }
        public string TransactionType { get; set; }
        public decimal RunningTotal { get; set; }
        public decimal AmountInBaseCurrency { get; set; }
        public string Alias { get; set; }
    }

    public class TransactionModel {
        public IEnumerable<Transaction> Transactions { get; set; }
        public int RemainingTransactionCount { get; set; }
        public decimal StartingBalance { get; set; }
    }
}
