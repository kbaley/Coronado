using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
  public class InvestmentRepository : BaseRepository, IInvestmentRepository
    {
        public InvestmentRepository(IConfiguration config) : base(config) { }

        public Investment Delete(Guid investmentId)
        {
            using (var conn = Connection) {
                var investment = conn.QuerySingle<Investment>("SELECT * FROM investments WHERE investment_id=@investmentId", new {investmentId});
                conn.Execute("DELETE FROM investment_prices WHERE investment_id=@investmentId", new {investmentId});
                conn.Execute("DELETE FROM investments WHERE investment_id=@investmentId", new {investmentId});
                return investment;
            }    
        }

        public IEnumerable<Investment> GetAll()
        {
            using (var conn = Connection)
            {
                var investmentDictionary = new Dictionary<Guid, Investment>();
                // Make sure investment_id is listed first in the joined table for Dapper to work
                var invoices = conn.Query<Investment, InvestmentPrice, Investment>(
                    @"SELECT i.*, p.investment_id, p.investment_price_id as investment_price_id, p.date, p.price
                    FROM investments i left join investment_prices p on i.investment_id = p.investment_id",
                (investment, price) =>
                {
                    Investment investmentEntry;
                    if (!investmentDictionary.TryGetValue(investment.InvestmentId, out investmentEntry))
                    {
                        investmentEntry = investment;
                        investmentEntry.HistoricalPrices = new List<InvestmentPrice>();
                        investmentDictionary.Add(investmentEntry.InvestmentId, investmentEntry);
                    }

                    investmentEntry.HistoricalPrices.Add(price);
                    return investmentEntry;
                },
                splitOn: "investment_id")
                .Distinct();
                return invoices;
            }
        }

        public void Insert(Investment investment)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO investments (investment_id, name, symbol, shares, price, url, last_retrieved, currency)
VALUES (@InvestmentId, @Name, @Symbol, @Shares, @Price, @Url, @LastRetrieved, @Currency)", investment);
            }
        }

        public void Update(Investment investment)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE investments
SET name = @Name, symbol=@Symbol, shares=@Shares, price=@Price, url=@Url, last_retrieved=@LastRetrieved, currency=@Currency
WHERE investment_id = @InvestmentId", investment);
            }
        }
    }
}
