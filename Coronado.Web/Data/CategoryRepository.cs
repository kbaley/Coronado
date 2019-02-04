using System;
using System.Collections.Generic;
using Coronado.Web.Models;
using Microsoft.Extensions.Configuration;
using Dapper;
using Coronado.Web.Domain;

namespace Coronado.Web.Data
{
    public class CategoryRepository : BaseRepository, ICategoryRepository
    {
        public CategoryRepository(IConfiguration config) : base(config) { }

        public Category Delete(Guid categoryId)
        {
            using (var conn = Connection)
            {
                conn.Execute("UPDATE transactions SET category_id = NULL WHERE category_id=@categoryId", new { categoryId });
                var category = conn.QuerySingle<Category>("SELECT * FROM categories WHERE category_id=@categoryId", new { categoryId });
                conn.Execute("DELETE FROM categories WHERE category_id=@categoryId", new { categoryId });
                return category;
            }
        }

        public IEnumerable<Category> GetAll()
        {
            using (var conn = Connection)
            {
                return conn.Query<Category>("SELECT * FROM categories");
            }
        }

        public void Insert(Category category)
        {
            using (var conn = Connection)
            {
                conn.Execute(
        @"INSERT INTO categories (category_id, name, type, parent_category_id)
VALUES (@CategoryId, @Name, @Type, @ParentCategoryId)", category);
            }
        }

        public void Update(Category category)
        {
            using (var conn = Connection)
            {
                conn.Execute(
        @"UPDATE categories
SET name = @Name, type = @Type, parent_category_id = @ParentCategoryId
WHERE category_id = @CategoryId", category);
            }
        }
    }
}
