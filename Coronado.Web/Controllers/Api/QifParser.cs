using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Controllers.Dtos;
using Microsoft.AspNetCore.Http;
using Coronado.Web.Domain;

namespace Coronado.Web.Controllers.Api
{
    public class QifParser
    {
        private readonly CoronadoDbContext _context;

        public QifParser(CoronadoDbContext context)
        {
            _context = context;
        }

        public IEnumerable<TransactionForDisplay> Parse(IFormFile file, Guid accountId, DateTime? fromDate)
        {
            var transactions = new List<TransactionForDisplay>();
            if (file.Length > 0)
            {
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    var peek = reader.Peek();
                    if (peek != -1)
                    {
                        if ((char)peek == '!')
                            transactions = ParseQif(reader, accountId, fromDate);
                        else
                            transactions = ParseCsv(reader, accountId, fromDate);
                    }
                }
            }
            return transactions;
        }

        // Assumes we're parsing for a credit card, specifically AMEX
        private List<TransactionForDisplay> ParseCsv(StreamReader reader, Guid accountId, DateTime? fromDate)
        {
            var transactions = new List<TransactionForDisplay>();
            // Trash the header line
            reader.ReadLine();

            while (reader.Peek() >=0)
            {
                var line = reader.ReadLine().Split(',');
                var trx = new TransactionForDisplay
                {
                    TransactionId = Guid.NewGuid(),
                    AccountId = accountId,
                    EnteredDate = DateTime.Now,
                    Vendor = "",
                    TransactionDate = DateTime.Parse(line[0]),
                    Description = line[1],
                    Amount = -decimal.Parse(line[4])
                };
                trx.SetDebitAndCredit();
                if (!fromDate.HasValue || trx.TransactionDate >= fromDate.Value)
                    transactions.Add(trx);
            }
            return transactions;
        }

        private List<TransactionForDisplay> ParseQif(StreamReader reader, Guid accountId, DateTime? fromDate)
        {
            var transactions = new List<TransactionForDisplay>();
            var trx = new TransactionForDisplay
            {
                TransactionId = Guid.NewGuid(),
                AccountId = accountId,
                EnteredDate = DateTime.Now,
                TransactionType = TRANSACTION_TYPE.REGULAR,
                Vendor = ""
            };
            while (reader.Peek() >= 0)
            {
                var line = reader.ReadLine();
                if (line.Length > 1 || line == "^")
                {
                    switch (line[0])
                    {
                        case '^':
                            if (!fromDate.HasValue || trx.TransactionDate >= fromDate.Value)
                            {
                                if (trx.Vendor.StartsWith("Transfer :", StringComparison.CurrentCultureIgnoreCase))
                                {
                                    var relatedAccountName = trx.Vendor.Replace("Transfer : ", "");
                                    var relatedAccount = _context.Accounts.Single(a => a.Name == relatedAccountName);
                                    trx.TransactionType = TRANSACTION_TYPE.TRANSFER;
                                    trx.RelatedAccountId = relatedAccount.AccountId;
                                    trx.Vendor = "";
                                }
                                trx.SetDebitAndCredit();
                                transactions.Add(trx);
                            }
                            trx = new TransactionForDisplay
                            {
                                TransactionId = Guid.NewGuid(),
                                AccountId = accountId,
                                EnteredDate = DateTime.Now,
                                TransactionType = TRANSACTION_TYPE.REGULAR,
                                Vendor = ""
                            };
                            break;
                        case 'D':
                            trx.TransactionDate = DateTime.Parse(line.Substring(1));
                            break;
                        case 'T':
                            trx.Amount = decimal.Parse(line.Substring(1));
                            break;
                        case 'P':
                            trx.Vendor = line.Substring(1);
                            break;
                        case 'L':
                            var category = line.Substring(1)
                              .Replace("Everyday Expenses:", "")
                              .Replace("Rainy Day Funds:", "")
                              .Replace("Monthly Bills:", "");
                            trx.CategoryId = _context.GetOrCreateCategory(category).GetAwaiter().GetResult().CategoryId;
                            break;
                        case 'M':
                            trx.Description = line.Substring(1);
                            break;
                        case 'C':
                            trx.IsReconciled = line.Substring(1) == "c";
                            break;
                    }
                }
            }
            return transactions;
        }
    }
}
