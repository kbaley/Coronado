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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;
        public CategoryRepository(IConfiguration config)
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

        public Category Delete(Guid categoryId)
        {
            using (var conn = Connection) {
                conn.Execute("UPDATE transactions SET category_id = NULL WHERE category_id=@categoryId", new {categoryId});
                var category = conn.QuerySingle<Category>("SELECT * FROM categories WHERE category_id=@categoryId", new {categoryId});
                conn.Execute("DELETE FROM categories WHERE category_id=@categoryId", new {categoryId});
                return category;
            }    
        }

        public IEnumerable<Category> GetAll()
        {
            using (var conn = Connection) {
                return conn.Query<Category>("SELECT * FROM categories");
            }
        }

        public void Insert(Category category)
        {
            using (var conn = Connection) {
                conn.Execute(
@"INSERT INTO categories (category_id, name, type, parent_category_id)
VALUES (@CategoryId, @Name, @Type, @ParentCategoryId)", category);
            }
        }

        public void Update(Category category)
        {
            using (var conn = Connection) {
                conn.Execute(
@"UPDATE categories
SET name = @Name, type = @Type, parent_category_id = @ParentCategoryId
WHERE category_id = @CategoryId", category);
            }
        }
    }
}
