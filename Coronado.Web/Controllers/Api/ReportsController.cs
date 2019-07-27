using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Dynamic;

namespace Coronado.Web.Controllers.Api
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepo;
        private readonly ICategoryRepository _categoryRepo;

        public ReportsController(ApplicationDbContext context, ITransactionRepository transactionRepo, ICategoryRepository categoryRepo)
        {
            _transactionRepo = transactionRepo;
            _categoryRepo = categoryRepo;
        }

        [HttpGet]
        public IActionResult NetWorth([FromQuery] ReportQuery query )
        {
            var netWorth = new List<dynamic>();
            var numItems = 6;
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
            var numItems = 8;
            var categories = _categoryRepo.GetAll().Where(c => c.Type == "Expense");
            DateTime date;
            foreach (var category in categories)
            {
                var expenses = new List<dynamic>();
                date = DateTime.Today.FirstDayOfMonth();
                for (var i = 0; i < numItems; i++) {
                    expenses.Add(new { date, amount = 0.0M});
                    date = date.AddMonths(-1).FirstDayOfMonth();
                }
                report.Add(category.CategoryId, new { categoryId = category.CategoryId, name = category.Name, expenses});
            }
            date = DateTime.Today.FirstDayOfMonth();
            for (var i = 0; i < numItems; i++) {
                var expenseList = _transactionRepo.GetExpensesByCategory(date, date.LastDayOfMonth());
                foreach (var item in expenseList)
                {
                    var entry = report[item.category_id];
                    var expenses = (List<dynamic>)entry.expenses;
                    var dateEntry = expenses.First(e => e.date == date);
                    expenses.Remove(dateEntry);
                    expenses.Add(new { date, amount = item.amount});
                }
                date = date.AddMonths(-1).FirstDayOfMonth();
            }
            return Ok(report.Values);
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