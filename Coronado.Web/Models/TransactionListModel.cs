using System.Collections.Generic;

namespace Coronado.Web.Models 
{
    public class TransactionListModel {
        public IEnumerable<TransactionForDisplay> Transactions { get; set; }
        public int Page { get; set; }
        public int RemainingTransactionCount { get; set; }

        public decimal StartingBalance { get; set; }
    }
}