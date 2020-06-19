using System;
using System.Collections.Generic;

namespace Coronado.ConsoleApp.Domain
{
    public class Transaction {
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

        public override string ToString() {
            var str = $"{Alias.PadRight(5, '.')}";
            str += $"{TransactionDate.ToShortDateString().PadLeft(11, '.')}...";
            str += $"{Vendor.PadLeft(25, '.')}...";
            str += $"{CategoryDisplay.PadLeft(30, '.')}...";

            if (Amount > 0) {
                str += ".".PadLeft(15, '.');
                str += $"{Amount.ToString("#,##0.00").PadLeft(10, '.')}";
                str += ".".PadLeft(3, '.');
            } else {
                str += ".".PadLeft(3, '.');
                str += $"{(-Amount).ToString("#,##0.00").PadLeft(10, '.')}";
                str += ".".PadLeft(15, '.');
            }
            str += $"{RunningTotal.ToString("#,##0.00").PadLeft(10, '.')}";

            return str;
        }
    }

    public class TransactionModel {
        public IEnumerable<Transaction> Transactions { get; set; }
        public int RemainingTransactionCount { get; set; }
        public decimal StartingBalance { get; set; }
    }
}
