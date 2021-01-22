﻿// <auto-generated />
using System;
using Coronado.Web.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Coronado.Web.Migrations
{
    [DbContext(typeof(CoronadoDbContext))]
    partial class CoronadoDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Coronado.Web.Domain.Account", b =>
                {
                    b.Property<Guid>("AccountId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("account_id")
                        .HasColumnType("uuid");

                    b.Property<string>("AccountType")
                        .HasColumnName("account_type")
                        .HasColumnType("text");

                    b.Property<string>("Currency")
                        .IsRequired()
                        .HasColumnName("currency")
                        .HasColumnType("text");

                    b.Property<int>("DisplayOrder")
                        .HasColumnName("display_order")
                        .HasColumnType("integer");

                    b.Property<bool>("IsHidden")
                        .HasColumnName("is_hidden")
                        .HasColumnType("boolean");

                    b.Property<decimal?>("MortgagePayment")
                        .HasColumnName("mortgage_payment")
                        .HasColumnType("numeric");

                    b.Property<string>("MortgageType")
                        .HasColumnName("mortgage_type")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<string>("Vendor")
                        .HasColumnName("vendor")
                        .HasColumnType("text");

                    b.HasKey("AccountId")
                        .HasName("pk_accounts");

                    b.ToTable("accounts");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Category", b =>
                {
                    b.Property<Guid>("CategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<Guid?>("ParentCategoryId")
                        .HasColumnName("parent_category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnName("type")
                        .HasColumnType("text");

                    b.HasKey("CategoryId")
                        .HasName("pk_categories");

                    b.HasIndex("ParentCategoryId")
                        .HasName("ix_categories_parent_category_id");

                    b.ToTable("categories");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Configuration", b =>
                {
                    b.Property<Guid>("ConfigurationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("configuration_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .HasColumnName("value")
                        .HasColumnType("text");

                    b.HasKey("ConfigurationId")
                        .HasName("pk_configuration");

                    b.ToTable("configuration");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Currency", b =>
                {
                    b.Property<Guid>("CurrencyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("currency_id")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("LastRetrieved")
                        .HasColumnName("last_retrieved")
                        .HasColumnType("timestamp without time zone");

                    b.Property<decimal>("PriceInUsd")
                        .HasColumnName("price_in_usd")
                        .HasColumnType("numeric");

                    b.Property<string>("Symbol")
                        .HasColumnName("symbol")
                        .HasColumnType("text");

                    b.HasKey("CurrencyId")
                        .HasName("pk_currencies");

                    b.ToTable("currencies");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Customer", b =>
                {
                    b.Property<Guid>("CustomerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("customer_id")
                        .HasColumnType("uuid");

                    b.Property<string>("City")
                        .HasColumnName("city")
                        .HasColumnType("text");

                    b.Property<string>("Email")
                        .HasColumnName("email")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<string>("Region")
                        .HasColumnName("region")
                        .HasColumnType("text");

                    b.Property<string>("StreetAddress")
                        .HasColumnName("street_address")
                        .HasColumnType("text");

                    b.HasKey("CustomerId")
                        .HasName("pk_customers");

                    b.ToTable("customers");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Investment", b =>
                {
                    b.Property<Guid>("InvestmentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("investment_id")
                        .HasColumnType("uuid");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnName("category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Currency")
                        .HasColumnName("currency")
                        .HasColumnType("text");

                    b.Property<bool>("DontRetrievePrices")
                        .HasColumnName("dont_retrieve_prices")
                        .HasColumnType("boolean");

                    b.Property<decimal>("LastPrice")
                        .HasColumnName("last_price")
                        .HasColumnType("numeric");

                    b.Property<DateTime>("LastPriceRetrievalDate")
                        .HasColumnName("last_price_retrieval_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<bool>("PaysDividends")
                        .HasColumnName("pays_dividends")
                        .HasColumnType("boolean");

                    b.Property<string>("Symbol")
                        .HasColumnName("symbol")
                        .HasColumnType("text");

                    b.HasKey("InvestmentId")
                        .HasName("pk_investments");

                    b.HasIndex("CategoryId")
                        .HasName("ix_investments_category_id");

                    b.ToTable("investments");
                });

            modelBuilder.Entity("Coronado.Web.Domain.InvestmentCategory", b =>
                {
                    b.Property<Guid>("InvestmentCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("investment_category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<decimal>("Percentage")
                        .HasColumnName("percentage")
                        .HasColumnType("numeric");

                    b.HasKey("InvestmentCategoryId")
                        .HasName("pk_investment_categories");

                    b.ToTable("investment_categories");
                });

            modelBuilder.Entity("Coronado.Web.Domain.InvestmentTransaction", b =>
                {
                    b.Property<Guid>("InvestmentTransactionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("investment_transaction_id")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Date")
                        .HasColumnName("date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid>("InvestmentId")
                        .HasColumnName("investment_id")
                        .HasColumnType("uuid");

                    b.Property<decimal>("Price")
                        .HasColumnName("price")
                        .HasColumnType("numeric");

                    b.Property<decimal>("Shares")
                        .HasColumnName("shares")
                        .HasColumnType("numeric");

                    b.Property<Guid>("TransactionId")
                        .HasColumnName("transaction_id")
                        .HasColumnType("uuid");

                    b.HasKey("InvestmentTransactionId")
                        .HasName("pk_investment_transactions");

                    b.HasIndex("InvestmentId")
                        .HasName("ix_investment_transactions_investment_id");

                    b.HasIndex("TransactionId")
                        .HasName("ix_investment_transactions_transaction_id");

                    b.ToTable("investment_transactions");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Invoice", b =>
                {
                    b.Property<Guid>("InvoiceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("invoice_id")
                        .HasColumnType("uuid");

                    b.Property<decimal>("Balance")
                        .HasColumnName("balance")
                        .HasColumnType("numeric");

                    b.Property<Guid>("CustomerId")
                        .HasColumnName("customer_id")
                        .HasColumnType("uuid");

                    b.Property<DateTime>("Date")
                        .HasColumnName("date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("InvoiceNumber")
                        .IsRequired()
                        .HasColumnName("invoice_number")
                        .HasColumnType("text");

                    b.Property<bool>("IsPaidInFull")
                        .HasColumnName("is_paid_in_full")
                        .HasColumnType("boolean");

                    b.Property<DateTime?>("LastSentToCustomer")
                        .HasColumnName("last_sent_to_customer")
                        .HasColumnType("timestamp without time zone");

                    b.HasKey("InvoiceId")
                        .HasName("pk_invoices");

                    b.HasIndex("CustomerId")
                        .HasName("ix_invoices_customer_id");

                    b.ToTable("invoices");
                });

            modelBuilder.Entity("Coronado.Web.Domain.InvoiceLineItem", b =>
                {
                    b.Property<Guid>("InvoiceLineItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("invoice_line_item_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("CategoryId")
                        .HasColumnName("category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnName("description")
                        .HasColumnType("text");

                    b.Property<Guid>("InvoiceId")
                        .HasColumnName("invoice_id")
                        .HasColumnType("uuid");

                    b.Property<decimal>("Quantity")
                        .HasColumnName("quantity")
                        .HasColumnType("numeric");

                    b.Property<decimal>("UnitAmount")
                        .HasColumnName("unit_amount")
                        .HasColumnType("numeric");

                    b.HasKey("InvoiceLineItemId")
                        .HasName("pk_invoice_line_items");

                    b.HasIndex("CategoryId")
                        .HasName("ix_invoice_line_items_category_id");

                    b.HasIndex("InvoiceId")
                        .HasName("ix_invoice_line_items_invoice_id");

                    b.ToTable("invoice_line_items");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Transaction", b =>
                {
                    b.Property<Guid>("TransactionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("transaction_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("AccountId")
                        .HasColumnName("account_id")
                        .HasColumnType("uuid");

                    b.Property<decimal>("Amount")
                        .HasColumnName("amount")
                        .HasColumnType("numeric");

                    b.Property<decimal>("AmountInBaseCurrency")
                        .HasColumnName("amount_in_base_currency")
                        .HasColumnType("numeric");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnName("category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Description")
                        .HasColumnName("description")
                        .HasColumnType("text");

                    b.Property<Guid?>("DividendInvestmentId")
                        .HasColumnName("dividend_investment_id")
                        .HasColumnType("uuid");

                    b.Property<string>("DownloadId")
                        .HasColumnName("download_id")
                        .HasColumnType("text");

                    b.Property<DateTime>("EnteredDate")
                        .HasColumnName("entered_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<Guid?>("InvoiceId")
                        .HasColumnName("invoice_id")
                        .HasColumnType("uuid");

                    b.Property<bool>("IsReconciled")
                        .HasColumnName("is_reconciled")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnName("transaction_date")
                        .HasColumnType("timestamp without time zone");

                    b.Property<int>("TransactionType")
                        .HasColumnName("transaction_type")
                        .HasColumnType("integer");

                    b.Property<string>("Vendor")
                        .HasColumnName("vendor")
                        .HasColumnType("text");

                    b.HasKey("TransactionId")
                        .HasName("pk_transactions");

                    b.HasIndex("AccountId")
                        .HasName("ix_transactions_account_id");

                    b.HasIndex("CategoryId")
                        .HasName("ix_transactions_category_id");

                    b.HasIndex("DividendInvestmentId")
                        .HasName("ix_transactions_dividend_investment_id");

                    b.HasIndex("InvoiceId")
                        .HasName("ix_transactions_invoice_id");

                    b.ToTable("transactions");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Transfer", b =>
                {
                    b.Property<Guid>("TransferId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("transfer_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("LeftTransactionId")
                        .HasColumnName("left_transaction_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("RightTransactionId")
                        .HasColumnName("right_transaction_id")
                        .HasColumnType("uuid");

                    b.HasKey("TransferId")
                        .HasName("pk_transfers");

                    b.HasIndex("LeftTransactionId")
                        .IsUnique()
                        .HasName("ix_transfers_left_transaction_id");

                    b.HasIndex("RightTransactionId")
                        .IsUnique()
                        .HasName("ix_transfers_right_transaction_id");

                    b.ToTable("transfers");
                });

            modelBuilder.Entity("Coronado.Web.Domain.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("user_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnName("email")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnName("password")
                        .HasColumnType("text");

                    b.HasKey("UserId")
                        .HasName("pk_users");

                    b.ToTable("users");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Vendor", b =>
                {
                    b.Property<Guid>("VendorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("vendor_id")
                        .HasColumnType("uuid");

                    b.Property<Guid>("LastTransactionCategoryId")
                        .HasColumnName("last_transaction_category_id")
                        .HasColumnType("uuid");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnName("name")
                        .HasColumnType("text");

                    b.HasKey("VendorId")
                        .HasName("pk_vendors");

                    b.ToTable("vendors");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Category", b =>
                {
                    b.HasOne("Coronado.Web.Domain.Category", "ParentCategory")
                        .WithMany()
                        .HasForeignKey("ParentCategoryId")
                        .HasConstraintName("fk_categories_categories_parent_category_id");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Investment", b =>
                {
                    b.HasOne("Coronado.Web.Domain.InvestmentCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .HasConstraintName("fk_investments_investment_categories_category_id");
                });

            modelBuilder.Entity("Coronado.Web.Domain.InvestmentTransaction", b =>
                {
                    b.HasOne("Coronado.Web.Domain.Investment", null)
                        .WithMany("Transactions")
                        .HasForeignKey("InvestmentId")
                        .HasConstraintName("fk_investment_transactions_investments_investment_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Coronado.Web.Domain.Transaction", "Transaction")
                        .WithMany()
                        .HasForeignKey("TransactionId")
                        .HasConstraintName("fk_investment_transactions_transactions_transaction_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coronado.Web.Domain.Invoice", b =>
                {
                    b.HasOne("Coronado.Web.Domain.Customer", "Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId")
                        .HasConstraintName("fk_invoices_customers_customer_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coronado.Web.Domain.InvoiceLineItem", b =>
                {
                    b.HasOne("Coronado.Web.Domain.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .HasConstraintName("fk_invoice_line_items_categories_category_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Coronado.Web.Domain.Invoice", "Invoice")
                        .WithMany("LineItems")
                        .HasForeignKey("InvoiceId")
                        .HasConstraintName("fk_invoice_line_items_invoices_invoice_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Coronado.Web.Domain.Transaction", b =>
                {
                    b.HasOne("Coronado.Web.Domain.Account", "Account")
                        .WithMany("Transactions")
                        .HasForeignKey("AccountId")
                        .HasConstraintName("fk_transactions_accounts_account_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Coronado.Web.Domain.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .HasConstraintName("fk_transactions_categories_category_id");

                    b.HasOne("Coronado.Web.Domain.Investment", null)
                        .WithMany("Dividends")
                        .HasForeignKey("DividendInvestmentId")
                        .HasConstraintName("fk_transactions_investments_dividend_investment_id");

                    b.HasOne("Coronado.Web.Domain.Invoice", "Invoice")
                        .WithMany()
                        .HasForeignKey("InvoiceId")
                        .HasConstraintName("fk_transactions_invoices_invoice_id");
                });

            modelBuilder.Entity("Coronado.Web.Domain.Transfer", b =>
                {
                    b.HasOne("Coronado.Web.Domain.Transaction", "LeftTransaction")
                        .WithOne("LeftTransfer")
                        .HasForeignKey("Coronado.Web.Domain.Transfer", "LeftTransactionId")
                        .HasConstraintName("fk_transfers_transactions_left_transaction_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Coronado.Web.Domain.Transaction", "RightTransaction")
                        .WithOne("RightTransfer")
                        .HasForeignKey("Coronado.Web.Domain.Transfer", "RightTransactionId")
                        .HasConstraintName("fk_transfers_transactions_right_transaction_id")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
