using System.Collections.Generic;

namespace Coronado.Web.Models
{
    public class TransactionListModel
    {
        public IList<TransactionModel> Transactions { get; set; }

        public TransactionListModel()
        {
            Transactions = new List<TransactionModel>();
        }
    }
}