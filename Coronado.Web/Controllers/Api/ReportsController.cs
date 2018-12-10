using System;
using System.Linq;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Coronado.Web.Models;
using System.Collections.Generic;

namespace Coronado.Web.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ITransactionRepository _transactionRepo;

        public ReportsController(ApplicationDbContext context, ITransactionRepository transactionRepo)
        {
            _transactionRepo = transactionRepo;
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

    }

    public static class Extensions {
        public static DateTime LastDayOfMonth(this DateTime date) {
            var lastDay = date.AddMonths(1);
            lastDay = new DateTime(lastDay.Year, lastDay.Month, 1);
            return lastDay.AddDays(-1);
        }
    }
}