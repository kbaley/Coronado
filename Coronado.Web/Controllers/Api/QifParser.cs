using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Coronado.Web.Data;
using Coronado.Web.Controllers.Dtos;
using Microsoft.AspNetCore.Http;

namespace Coronado.Web.Controllers.Api
{
    public class QifParser
    {
        private readonly CoronadoDbContext _context;
        private readonly IAccountRepository _accountRepo;

        public QifParser(CoronadoDbContext context, IAccountRepository accountRepo)
        {
            _context = context;
            _accountRepo = accountRepo;
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

                                    // For positive transfers, assume they've been handled elsewhere
                                    if (trx.Amount > 0) break;
                                    var accountName = trx.Vendor.Replace("Transfer : ", "");
                                    var account = _accountRepo.GetAll().Single(a => a.Name == accountName);
                                    var relatedTransaction = new TransactionForDisplay
                                    {
                                        TransactionId = Guid.NewGuid(),
                                        AccountId = account.AccountId,
                                        EnteredDate = trx.EnteredDate,
                                        Amount = 0 - trx.Amount,
                                        Description = trx.Description,
                                        IsReconciled = trx.IsReconciled,
                                        TransactionDate = trx.TransactionDate,
                                        RelatedTransactionId = trx.TransactionId
                                    };
                                    trx.Vendor = "";
                                    trx.RelatedTransactionId = relatedTransaction.TransactionId;
                                    transactions.Add(relatedTransaction);
                                }
                                trx.SetDebitAndCredit();
                                transactions.Add(trx);
                            }
                            trx = new TransactionForDisplay
                            {
                                TransactionId = Guid.NewGuid(),
                                AccountId = accountId,
                                EnteredDate = DateTime.Now,
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
