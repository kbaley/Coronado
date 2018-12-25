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
  public class InvestmentRepository : IInvestmentRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public InvestmentRepository(IConfiguration config)
        {
            _config = config;
            _connectionString = config.GetConnectionString("DefaultConnection");
            Dapper.DefaultTypeMap.MatchNamesWithUnderscores = true;
        }

        internal IDbConnection Connection
        {
            get
            {
                return new NpgsqlConnection(_connectionString);
            }
        }

        public Investment Delete(Guid investmentId)
        {
            using (var conn = Connection) {
                var investment = conn.QuerySingle<Investment>("SELECT * FROM customers WHERE customer_id=@customerId", new {investmentId});
                conn.Execute("DELETE FROM customers WHERE customer_id=@customerId", new {investmentId});
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
@"INSERT INTO investments (investment_id, name, symbol, shares, price, url)
VALUES (@InvestmentId, @Name, @Symbol, @Shares, @Price, @Url)", investment);
            }
        }

        public void Update(Investment investment)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE investments
SET name = @Name, symbol=@Symbol, shares=@Shares, price=@Price, Url=@url
WHERE investment_id = @InvestmentId", investment);
            }
        }
    }
}
