using System;
using System.Collections.Generic;
using System.Text;
using Coronado.Web.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) {
            base.OnModelCreating(builder);

            foreach (var entity in builder.Model.GetEntityTypes()) {
                // Replace table names
                entity.Relational().TableName = entity.Relational().TableName.ToSnakeCase();

                // Replace column names            
                foreach (var property in entity.GetProperties()) {
                    property.Relational().ColumnName = property.Name.ToSnakeCase();
                }

                foreach (var key in entity.GetKeys()) {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase();
                }

                foreach (var key in entity.GetForeignKeys()) {
                    key.Relational().Name = key.Relational().Name.ToSnakeCase();
                }

                foreach (var index in entity.GetIndexes()) {
                    index.Relational().Name = index.Relational().Name.ToSnakeCase();
                }
            }

            builder.Entity<Category>().HasData(
                new Category { CategoryId = Guid.NewGuid(), Name = "Starting Balance", Type = "Income" }
            );

            builder.Entity<Category>().HasData(
                new Category { CategoryId = Guid.NewGuid(), Name = "Bank Fees", Type = "Expense" }
            );
        }
    }
}
