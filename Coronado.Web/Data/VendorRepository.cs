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
    public class VendorRepository : BaseRepository, IVendorRepository
    {
        public VendorRepository(IConfiguration config) : base(config) { }

        public IEnumerable<Vendor> GetAll()
        {
            using (var conn = Connection)
            {
                return conn.Query<Vendor>("SELECT * FROM vendors");
            }
        }
    }
}
