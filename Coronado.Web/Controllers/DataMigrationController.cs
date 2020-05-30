using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using Coronado.Web.Domain;
using System.Collections.Generic;

namespace Coronado.Web.Controllers
{
    public class DataMigrationController : Controller
    {
        private readonly CoronadoDbContext _context;
        private readonly ILogger _logger;

        public DataMigrationController(CoronadoDbContext context,
          ILogger<DataMigrationController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void MigrateTransfers()
        {
            // var transactions = _context.Transactions
            //     .Where(t => t.RelatedTransactionId != null);
            // var list = new Dictionary<Guid, Guid>();
            // foreach (var trx in transactions)
            // {
            //     var leftId = trx.TransactionId;
            //     var rightId = trx.RelatedTransactionId.Value;
            //     if (!list.ContainsKey(leftId) && !list.ContainsKey(rightId)) {
            //         list.Add(leftId, rightId);
            //     }
            // }

            // foreach (var leftKey in list.Keys)
            // {
            //     var transfer = new Transfer{
            //         TransferId = Guid.NewGuid(),
            //         LeftTransactionId = leftKey,
            //         RightTransactionId = list[leftKey]
            //     };
            //     await _context.Transfers.AddAsync(transfer).ConfigureAwait(false);
            // }
            // await _context.SaveChangesAsync().ConfigureAwait(false);
        }

    }
}
