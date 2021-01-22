using System;
using System.Collections.Generic;
using Coronado.Web.Controllers.Dtos;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Data
{
    public class ReportRepository : BaseRepository, IReportRepository
    {
        private readonly CoronadoDbContext _context;
        private readonly IMapper _mapper;

        public ReportRepository(IConfiguration config, CoronadoDbContext context, IMapper mapper) : base(config)
        {
            _context = context;
            _mapper = mapper;
        }

        public decimal GetNetWorthFor(DateTime date)
        {
            var exchangeRate = _context.Currencies.GetCadExchangeRate(date);
            var usTotal = _context
                .Transactions
                .Include(t => t.Account)
                .Where(t => t.TransactionDate <= date && t.Account.Currency == "USD")
                .Sum(t => t.Amount);
            var cadTotal = _context
                .Transactions
                .Include(t => t.Account)
                .Where(t => t.TransactionDate <= date && t.Account.Currency == "CAD")
                .Sum(t => t.Amount);
            return Math.Round(usTotal + (cadTotal / exchangeRate), 2);
        }

        public decimal GetInvestmentTotalFor(DateTime date)
        {
            var exchangeRate = _context.Currencies.GetCadExchangeRate(date);
            var usTotal = _context
                .Transactions
                .Include(t => t.Account)
                .Where(t => t.TransactionDate <= date 
                    && t.Account.AccountType == "Investment"
                    && t.Account.Currency == "USD")
                .Sum(t => t.Amount);
            var cadTotal = _context
                .Transactions
                .Include(t => t.Account)
                .Where(t => t.TransactionDate <= date 
                    && t.Account.AccountType == "Investment"
                    && t.Account.Currency == "CAD")
                .Sum(t => t.Amount);
            return Math.Round(usTotal + (cadTotal / exchangeRate), 2);
        }

        public IEnumerable<CategoryTotal> GetTransactionsByCategoryType(string categoryType, DateTime start, DateTime end)
        {
            var amountPrefix = "";
            if (categoryType == "Expense")
            {
                amountPrefix = "0 - ";
            }
            using var conn = Connection;
            var sql = "SELECT t.category_id, c.name, " + amountPrefix + "sum(amount_in_base_currency) as amount, EXTRACT(MONTH from t.transaction_date)::int as month, EXTRACT(YEAR from t.transaction_date)::int as year FROM transactions t " +
                "INNER JOIN categories c ON t.category_id = c.category_id " +
                "WHERE transaction_date > @start and transaction_date <= @end " +
                "AND c.Type = '" + categoryType + "' " +
                "GROUP BY t.category_id, c.name, EXTRACT(MONTH from t.transaction_date), EXTRACT(YEAR from t.transaction_date)";
            var data = conn.Query(sql, new { start, end });

            var results = data.GroupBy(x => x.category_id)
                            .Select(x => new CategoryTotal
                            {
                                CategoryId = x.Key,
                                CategoryName = x.First().name,
                                Amounts = x.Select(e => new DateAndAmount(e.year, e.month, e.amount)).ToList()
                            });

            return results;
        }

        public IEnumerable<CategoryTotal> GetInvoiceLineItemsIncomeTotals(DateTime start, DateTime end)
        {
            using var conn = Connection;
            var sql = @"
                    SELECT ili.category_id, c.name, sum(ili.quantity * ili.unit_amount) as amount, EXTRACT(MONTH from i.date)::int as month, 
                    EXTRACT(YEAR from i.date)::int as year 
                    FROM invoice_line_items ili
                    INNER JOIN categories c ON ili.category_id = c.category_id
                    INNER JOIN invoices i
                    ON ili.invoice_id = i.invoice_id
                    WHERE i.date > @start and i.date <= @end
                    AND c.Type = 'Income'
                    GROUP BY ili.category_id, c.name, EXTRACT(MONTH from i.date), EXTRACT(YEAR from i.date)";
            var data = conn.Query(sql, new { start, end });

            var results = data.GroupBy(x => x.category_id)
                            .Select(x => new CategoryTotal
                            {
                                CategoryId = x.Key,
                                CategoryName = x.First().name,
                                Amounts = x.Select(e => new DateAndAmount(e.year, e.month, e.amount)).ToList()
                            });

            return results;
        }

        public async Task<IEnumerable<dynamic>> GetMonthlyTotalsForCategory(Guid categoryId, DateTime start, DateTime end)
        {
            using var conn = Connection;
            var sql = @"SELECT sum(amount_in_base_currency) as amount, EXTRACT(MONTH from t.transaction_date)::int as month, EXTRACT(YEAR from t.transaction_date)::int as year FROM transactions t
                    WHERE transaction_date > @start and transaction_date <= @end
                    AND t.category_id = @categoryId
                    GROUP BY EXTRACT(MONTH from t.transaction_date), EXTRACT(YEAR from t.transaction_date)";
            var data = await conn.QueryAsync(sql, new { start, end, categoryId }).ConfigureAwait(false);
            var results = data.Select(e => new
            {
                date = new DateTime(e.year, e.month, 1),
                e.amount
            }).OrderByDescending(r => r.date);

            return results;
        }

    }
}
