using System;
using System.Collections.Generic;
using Coronado.Web.Models;

namespace Coronado.Web.Data
{
    public interface ITransactionRepository
    {
        IEnumerable<TransactionForDisplay> GetByAccount(Guid accountId);
        void Insert(TransactionForDisplay transaction);
        void Insert(IEnumerable<TransactionForDisplay> transactions);
        void Update(TransactionForDisplay transaction);
        void Delete(Guid transactionId);
        TransactionForDisplay Get(Guid transactionId);

        void InsertRelatedTransaction(TransactionForDisplay first, TransactionForDisplay second);
    }
}
