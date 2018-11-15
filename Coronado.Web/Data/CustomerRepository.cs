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
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public CustomerRepository(IConfiguration config)
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

        public Customer Delete(Guid customerId)
        {
            using (var conn = Connection) {
                var customer = conn.QuerySingle<Customer>("SELECT * FROM customers WHERE customer_id=@customerId", new {customerId});
                conn.Execute("DELETE FROM customers WHERE customer_id=@customerId", new {customerId});
                return customer;
            }    
        }

        public IEnumerable<Customer> GetAll()
        {
            using (var conn = Connection) {
                return conn.Query<Customer>("SELECT * FROM customers");
            }
        }

        public void Insert(Customer customer)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO customers (customer_id, name)
VALUES (@CustomerId, @Name)", customer);
            }
        }

        public void Update(Customer customer)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE customers
SET name = @Name
WHERE customer_id = @CustomerId", customer);
            }
        }
    }
}
