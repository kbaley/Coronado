using Coronado.Web.Domain;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<Vendor> Vendors { get;set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Configuration> Configurations { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entity in builder.Model.GetEntityTypes())
            {
                // Replace table names
                entity.SetTableName(entity.GetTableName().ToSnakeCase());

                // Replace column names            
                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(property.Name.ToSnakeCase());
                }

                foreach (var key in entity.GetKeys())
                {
                    key.SetName(key.GetName().ToSnakeCase());
                }

                foreach (var key in entity.GetForeignKeys())
                {
                    key.SetConstraintName(key.GetConstraintName().ToSnakeCase());
                }

                foreach (var index in entity.GetIndexes())
                {
                    index.SetName(index.GetName().ToSnakeCase());
                }
            }

            // builder.Entity<Category>().HasData(
            //     new Category { CategoryId = Guid.NewGuid(), Name = "Starting Balance", Type = "Income" }
            // );

            // builder.Entity<Category>().HasData(
            //     new Category { CategoryId = Guid.NewGuid(), Name = "Bank Fees", Type = "Expense" }
            // );
        }
    }
}
