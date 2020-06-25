using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Coronado.Web.Controllers.Dtos;

namespace Coronado.Web.Data
{
    public interface IReportRepository
    {
        decimal GetNetWorthFor(DateTime date);
        decimal GetInvestmentTotalFor(DateTime date);
        IEnumerable<CategoryTotal> GetTransactionsByCategoryType(string categoryType, DateTime start, DateTime end);
        Task<IEnumerable<dynamic>> GetMonthlyTotalsForCategory(Guid categoryId, DateTime start, DateTime end);
        IEnumerable<CategoryTotal> GetInvoiceLineItemsIncomeTotals(DateTime start, DateTime end);
    }
}
