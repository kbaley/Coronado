using System;
using System.Collections.Generic;
using System.Threading.Tasks;
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
        decimal GetNetWorthFor(DateTime date);

        IEnumerable<CategoryTotal> GetTransactionsByCategoryType(string categoryType, DateTime start, DateTime end);
        Task<IEnumerable<dynamic>> GetMonthlyTotalsForCategory(Guid categoryId, DateTime start, DateTime end);
        IEnumerable<CategoryTotal> GetInvoiceLineItemsIncomeTotals(DateTime start, DateTime end);
    }
}
