using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using Coronado.Web.Domain;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Controllers
{
    public class AccountsController : Controller
    {

        private readonly IConfiguration _config;
        private readonly CoronadoDbContext _context;

        public AccountsController(IConfiguration config, CoronadoDbContext context)
        {
            _config = config;
            _context = context;
        }

        [Route("admin/accounts/DownloadTransactions")]
        public IActionResult DownloadTransactions(Guid accountId)
        {
            var transactions = _context.Transactions
                .Include(t => t.Category)
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.TransactionDate)
                .Take(200);
            var lines = transactions
                .Select(GetLine);
            var csv = string.Join("\n", lines);

            return File(new UTF8Encoding().GetBytes(csv), "text/csv", "Transactions.csv");
        }
        
        private string GetLine(Transaction transaction) {
            var line = "";
            line += transaction.TransactionDate.ToString("MM/dd/yyyy") + ",";
            line += (transaction.Vendor?.Replace(",", "-") ?? "") + ",";
            if (transaction.Category != null) {
                line += transaction.Category.Name.Replace(",", "-") + ",";
            } else {
                line += ",";
            }
            line += transaction.Description.Replace(",", "-") + ",";
            line += transaction.Amount;
            return line;
        }

    }
}
