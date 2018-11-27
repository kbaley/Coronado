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
  public class VendorRepository : IVendorRepository
  {
    private readonly IConfiguration _config;
    private readonly string _connectionString;
    public VendorRepository(IConfiguration config)
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

    public IEnumerable<Vendor> GetAll()
    {
      using (var conn = Connection)
      {
        return conn.Query<Vendor>("SELECT * FROM vendors");
      }
    }
  }
}
