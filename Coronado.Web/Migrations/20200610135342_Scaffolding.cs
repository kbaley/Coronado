using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class Scaffolding : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "accounts",
                columns: table => new
                {
                    account_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    is_hidden = table.Column<bool>(nullable: false),
                    currency = table.Column<string>(nullable: false),
                    vendor = table.Column<string>(nullable: true),
                    account_type = table.Column<string>(nullable: true),
                    mortgage_payment = table.Column<decimal>(nullable: true),
                    mortgage_type = table.Column<string>(nullable: true),
                    display_order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_accounts", x => x.account_id);
                });

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    category_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: false),
                    type = table.Column<string>(nullable: false),
                    parent_category_id = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_categories", x => x.category_id);
                    table.ForeignKey(
                        name: "fk_categories_categories_parent_category_id",
                        column: x => x.parent_category_id,
                        principalTable: "categories",
                        principalColumn: "category_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "configuration",
                columns: table => new
                {
                    configuration_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_configuration", x => x.configuration_id);
                });

            migrationBuilder.CreateTable(
                name: "currencies",
                columns: table => new
                {
                    symbol = table.Column<string>(nullable: false),
                    last_retrieved = table.Column<DateTime>(nullable: false),
                    price_in_usd = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_currencies", x => x.symbol);
                });

            migrationBuilder.CreateTable(
                name: "customers",
                columns: table => new
                {
                    customer_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: false),
                    street_address = table.Column<string>(nullable: true),
                    city = table.Column<string>(nullable: true),
                    region = table.Column<string>(nullable: true),
                    email = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_customers", x => x.customer_id);
                });

            migrationBuilder.CreateTable(
                name: "investments",
                columns: table => new
                {
                    investment_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    symbol = table.Column<string>(nullable: true),
                    currency = table.Column<string>(nullable: true),
                    dont_retrieve_prices = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investments", x => x.investment_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<Guid>(nullable: false),
                    email = table.Column<string>(nullable: false),
                    name = table.Column<string>(nullable: false),
                    password = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "vendors",
                columns: table => new
                {
                    vendor_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: false),
                    last_transaction_category_id = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_vendors", x => x.vendor_id);
                });

            migrationBuilder.CreateTable(
                name: "invoices",
                columns: table => new
                {
                    invoice_id = table.Column<Guid>(nullable: false),
                    invoice_number = table.Column<string>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    customer_id = table.Column<Guid>(nullable: false),
                    balance = table.Column<decimal>(nullable: false),
                    is_paid_in_full = table.Column<bool>(nullable: false),
                    last_sent_to_customer = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoices", x => x.invoice_id);
                    table.ForeignKey(
                        name: "fk_invoices_customers_customer_id",
                        column: x => x.customer_id,
                        principalTable: "customers",
                        principalColumn: "customer_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "investment_prices",
                columns: table => new
                {
                    investment_price_id = table.Column<Guid>(nullable: false),
                    investment_id = table.Column<Guid>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    price = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investment_prices", x => x.investment_price_id);
                    table.ForeignKey(
                        name: "fk_investment_prices_investments_investment_id",
                        column: x => x.investment_id,
                        principalTable: "investments",
                        principalColumn: "investment_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invoice_line_items",
                columns: table => new
                {
                    invoice_line_item_id = table.Column<Guid>(nullable: false),
                    invoice_id = table.Column<Guid>(nullable: false),
                    quantity = table.Column<decimal>(nullable: false),
                    unit_amount = table.Column<decimal>(nullable: false),
                    description = table.Column<string>(nullable: true),
                    category_id = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invoice_line_items", x => x.invoice_line_item_id);
                    table.ForeignKey(
                        name: "fk_invoice_line_items_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "categories",
                        principalColumn: "category_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_invoice_line_items_invoices_invoice_id",
                        column: x => x.invoice_id,
                        principalTable: "invoices",
                        principalColumn: "invoice_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "transactions",
                columns: table => new
                {
                    transaction_id = table.Column<Guid>(nullable: false),
                    account_id = table.Column<Guid>(nullable: false),
                    vendor = table.Column<string>(nullable: true),
                    description = table.Column<string>(nullable: true),
                    amount = table.Column<decimal>(nullable: false),
                    is_reconciled = table.Column<bool>(nullable: false),
                    transaction_date = table.Column<DateTime>(nullable: false),
                    category_id = table.Column<Guid>(nullable: true),
                    entered_date = table.Column<DateTime>(nullable: false),
                    invoice_id = table.Column<Guid>(nullable: true),
                    transaction_type = table.Column<int>(nullable: false),
                    amount_in_base_currency = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_transactions", x => x.transaction_id);
                    table.ForeignKey(
                        name: "fk_transactions_accounts_account_id",
                        column: x => x.account_id,
                        principalTable: "accounts",
                        principalColumn: "account_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_transactions_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "categories",
                        principalColumn: "category_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_transactions_invoices_invoice_id",
                        column: x => x.invoice_id,
                        principalTable: "invoices",
                        principalColumn: "invoice_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "investment_transactions",
                columns: table => new
                {
                    investment_transaction_id = table.Column<Guid>(nullable: false),
                    investment_id = table.Column<Guid>(nullable: false),
                    shares = table.Column<decimal>(nullable: false),
                    price = table.Column<decimal>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    transaction_id = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investment_transactions", x => x.investment_transaction_id);
                    table.ForeignKey(
                        name: "fk_investment_transactions_investments_investment_id",
                        column: x => x.investment_id,
                        principalTable: "investments",
                        principalColumn: "investment_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_investment_transactions_transactions_transaction_id",
                        column: x => x.transaction_id,
                        principalTable: "transactions",
                        principalColumn: "transaction_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "transfers",
                columns: table => new
                {
                    transfer_id = table.Column<Guid>(nullable: false),
                    left_transaction_id = table.Column<Guid>(nullable: false),
                    right_transaction_id = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_transfers", x => x.transfer_id);
                    table.ForeignKey(
                        name: "fk_transfers_transactions_left_transaction_id",
                        column: x => x.left_transaction_id,
                        principalTable: "transactions",
                        principalColumn: "transaction_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_transfers_transactions_right_transaction_id",
                        column: x => x.right_transaction_id,
                        principalTable: "transactions",
                        principalColumn: "transaction_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_categories_parent_category_id",
                table: "categories",
                column: "parent_category_id");

            migrationBuilder.CreateIndex(
                name: "ix_investment_prices_investment_id",
                table: "investment_prices",
                column: "investment_id");

            migrationBuilder.CreateIndex(
                name: "ix_investment_transactions_investment_id",
                table: "investment_transactions",
                column: "investment_id");

            migrationBuilder.CreateIndex(
                name: "ix_investment_transactions_transaction_id",
                table: "investment_transactions",
                column: "transaction_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_line_items_category_id",
                table: "invoice_line_items",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoice_line_items_invoice_id",
                table: "invoice_line_items",
                column: "invoice_id");

            migrationBuilder.CreateIndex(
                name: "ix_invoices_customer_id",
                table: "invoices",
                column: "customer_id");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_account_id",
                table: "transactions",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_category_id",
                table: "transactions",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_invoice_id",
                table: "transactions",
                column: "invoice_id");

            migrationBuilder.CreateIndex(
                name: "ix_transfers_left_transaction_id",
                table: "transfers",
                column: "left_transaction_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_transfers_right_transaction_id",
                table: "transfers",
                column: "right_transaction_id",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "configuration");

            migrationBuilder.DropTable(
                name: "currencies");

            migrationBuilder.DropTable(
                name: "investment_prices");

            migrationBuilder.DropTable(
                name: "investment_transactions");

            migrationBuilder.DropTable(
                name: "invoice_line_items");

            migrationBuilder.DropTable(
                name: "transfers");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "vendors");

            migrationBuilder.DropTable(
                name: "investments");

            migrationBuilder.DropTable(
                name: "transactions");

            migrationBuilder.DropTable(
                name: "accounts");

            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "invoices");

            migrationBuilder.DropTable(
                name: "customers");
        }
    }
}
