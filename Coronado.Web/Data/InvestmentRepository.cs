using System;
using System.Collections.Generic;
using Coronado.Web.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Dapper;
using System.Data;
using Npgsql;
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
                conn.Execute("DELETE FROM investments WHERE investment_id=@investmentId", new {investmentId});
                return investment;
            }    
        }

        public IEnumerable<Investment> GetAll()
        {
            using (var conn = Connection) {
                return conn.Query<Investment>("SELECT * FROM investments");
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
