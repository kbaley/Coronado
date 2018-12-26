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
  public class CurrencyRepository : ICurrencyRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public CurrencyRepository(IConfiguration config)
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

        public Currency Get(string symbol)
        {
            using (var conn = Connection) {
                return conn.QuerySingleOrDefault<Currency>("SELECT * FROM currencies WHERE symbol=@symbol", new {symbol});
            }
        }

        public void Insert(Currency currency)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO currencies (symbol, last_retrieved, price_in_usd)
VALUES (@Symbol, @LastRetrieved, @PriceInUsd)", currency);
            }
        }

        public void Update(Currency currency)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE currencies
SET price_in_usd=@PriceInUsd, last_retrieved=@LastRetrieved
WHERE symbol=@Symbol", currency);
            }
        }
    }
}
