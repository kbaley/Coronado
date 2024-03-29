﻿using Coronado.Web.Domain;
using Microsoft.EntityFrameworkCore;

namespace Coronado.Web.Data
{
    public class CoronadoDbContext : DbContext
    {
        public CoronadoDbContext(DbContextOptions<CoronadoDbContext> options)
            : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceLineItem> InvoiceLineItems { get; set; }
        public DbSet<Vendor> Vendors { get;set; }
        public DbSet<Investment> Investments { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public DbSet<InvestmentTransaction> InvestmentTransactions { get; set; }
        public DbSet<Transfer> Transfers { get; set; }
        public DbSet<InvestmentCategory> InvestmentCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Transaction>()
                .HasOne(a => a.LeftTransfer)
                .WithOne(t => t.LeftTransaction);
            builder.Entity<Transaction>()
                .HasOne(a => a.RightTransfer)
                .WithOne(t => t.RightTransaction);
            
        }
    }
}
