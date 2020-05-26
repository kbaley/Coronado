using System;
using System.Linq;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Coronado.Web.Domain;
using System.Threading.Tasks;
using Coronado.Web.Controllers.Dtos;

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

            var date = query.EndDate;
            var numItems = DateTime.Today.Month + 1;
            if (query.SelectedYear != DateTime.Today.Year) {
                numItems = 13;
            }
            for (var i = 0; i < numItems; i++) {
                netWorth.Add(new {date, netWorth=_transactionRepo.GetNetWorthFor(date)});
                date = date.AddMonths(-1).LastDayOfMonth();
            }

            return Ok(new { report = netWorth, year = query.SelectedYear});
        }
        [HttpGet]
        public IActionResult Income([FromQuery] ReportQuery query) 
        {
            var year = query.Year ?? DateTime.Today.Year;
            var end = new DateTime(year, 12, 31);
            var start = new DateTime(year, 1, 1);
            var report = GetEntriesByCategoryType("Income", start, end);
            return Ok(report );
        }

        public class CategoryTotals {
            public IEnumerable<CategoryTotal> Expenses { get; set; }
            public dynamic MonthTotals { get; set; }
        }

        [HttpGet]
        public IActionResult ExpensesByCategory([FromQuery] ReportQuery query) 
        {
            var year = query.Year ?? DateTime.Today.Year;
            var end = new DateTime(year, 12, 31);
            var start = new DateTime(year, 1, 1);
            var report = GetEntriesByCategoryType("Expense", start, end);
            return Ok(report );
        }
        public dynamic GetEntriesByCategoryType(string categoryType, DateTime start, DateTime end)
        {
            var report = new Dictionary<Guid, dynamic>();
            var categories = _context.Categories.Where(c => c.Type == categoryType).ToList();
            var expenses = _transactionRepo.GetTransactionsByCategoryType(categoryType, start, end).ToList();
            if (categoryType == "Income") {
                var invoiceTotals = _transactionRepo.GetInvoiceLineItemsIncomeTotals(start, end);
                foreach (var item in invoiceTotals)
                {
                    var match = expenses.SingleOrDefault(e => e.CategoryId == item.CategoryId);
                    if (match == null) {
                        expenses.Add(item);
                    } else {
                        match.Merge(item);
                    }
                }
            }
            expenses.ForEach(e => e.Total = e.Amounts.Sum(a => a.Amount));
            expenses = expenses.OrderByDescending(e => e.Total).ToList();

            // Add categories with no expenses
            var missingCategories = categories.Where(c => expenses.All(e => e.CategoryId != c.CategoryId)).ToList();
            foreach (var category in missingCategories)
            {
                expenses.Add(new CategoryTotal{ 
                    CategoryId = category.CategoryId, 
                    CategoryName = category.Name, 
                    Total = 0.0M,
                    Amounts = new List<DateAndAmount>()});
            }
            var monthTotals = new List<dynamic>();
            var numMonths = end.Month - start.Month + 1; // Assumes we aren't spanning years
            for (var i = 0; i < numMonths; i++)
            {
                end = end.FirstDayOfMonth();
                var total = expenses.Sum(e => e.Amounts.Where(x => x.Date == end).Sum(x => x.Amount));
                monthTotals.Add(new { date = end, total });

                end = end.AddMonths(-1);
            }
            return new CategoryTotals{
                Expenses = expenses,
                MonthTotals = monthTotals
            };
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
            return new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month));
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
