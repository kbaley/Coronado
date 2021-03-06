using System;
using System.Collections.Generic;
using Coronado.Web.Controllers.Dtos;
using Coronado.Web.Domain;
using Coronado.Web.Models;

namespace Coronado.Web.Data
{
    public interface ITransactionRepository
    {
        TransactionListModel GetByAccount(Guid accountId, int? page);
        IEnumerable<TransactionForDisplay> GetByAccount(Guid accountId);
        IEnumerable<Transaction> Insert(TransactionForDisplay transaction);
        Transaction Update(TransactionForDisplay transaction);
        void Delete(Guid transactionId);
        TransactionForDisplay Get(Guid transactionId);
    }
}
