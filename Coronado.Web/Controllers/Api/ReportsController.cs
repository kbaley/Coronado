using System;
using System.Linq;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Coronado.Web.Domain;
using System.Threading.Tasks;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly CoronadoDbContext _context;
        private readonly ITransactionRepository _transactionRepo;

        public ReportsController(CoronadoDbContext context, ITransactionRepository transactionRepo)
        {
            _context = context;
            _transactionRepo = transactionRepo;
        }

        [HttpGet]
        public IActionResult NetWorth([FromQuery] ReportQuery query )
        {
            var netWorth = new List<dynamic>();

            var numItems = 13;
            var date = DateTime.Today.LastDayOfMonth();
            for (var i = 0; i < numItems; i++) {
                netWorth.Add(new {date, netWorth=_transactionRepo.GetNetWorthFor(date)});
                date = date.AddMonths(-1).LastDayOfMonth();
            }
            return Ok(netWorth);
        }

        [HttpGet]
        public IActionResult ExpensesByCategory([FromQuery] ReportQuery query) 
        {
            var report = new Dictionary<Guid, dynamic>();
            var numMonths = 8;
            var categories = _context.Categories.Where(c => c.Type == "Expense").ToList();
            var end = DateTime.Today.LastDayOfMonth();
            var start = end.AddMonths(0 - numMonths + 1).FirstDayOfMonth();
            var expenses = _transactionRepo.GetExpensesByCategory(start, end).ToList();

            // Add categories with no expenses
            var missingCategories = categories.Where(c => expenses.All(e => e.categoryId != c.CategoryId)).ToList();
            foreach (var category in missingCategories)
            {
                expenses.Add(new { categoryId = category.CategoryId, categoryName = category.Name, total = 0.0M, expenses = new List<dynamic>()});
            }
            var monthTotals = new List<dynamic>();
            for (int i = 0; i < numMonths; i++)
            {
                end = end.FirstDayOfMonth();
                var total = expenses.Sum(e => ((IEnumerable<dynamic>)e.expenses).Where(x => x.date == end).Sum(x => (decimal)x.amount));
                monthTotals.Add(new { date = end, total });

                end = end.AddMonths(-1);
            }
            return Ok(new { expenses, monthTotals } );
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardStats()
        {
            var numMonths = 3;
            var gainLossCategory = await _context.GetOrCreateCategory("Gain/loss on investments").ConfigureAwait(false);
            var end = DateTime.Today.LastDayOfMonth();
            var start = end.AddMonths(0 - numMonths).FirstDayOfMonth();
            var expenses = await _transactionRepo.GetMonthlyTotalsForCategory(gainLossCategory.CategoryId, start, end).ConfigureAwait(false);
            return Ok(expenses);
        }
    }

    public static class Extensions {
        public static DateTime LastDayOfMonth(this DateTime date) {
            var lastDay = date.AddMonths(1);
            lastDay = new DateTime(lastDay.Year, lastDay.Month, 1);
            return lastDay.AddDays(-1);
        }

        public static DateTime FirstDayOfMonth(this DateTime date) {
            return new DateTime(date.Year, date.Month, 1);
        }
    }

    public class NameAndId {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }
}
