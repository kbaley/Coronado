using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class InvestmentPriceHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "investment_price",
                columns: table => new
                {
                    investment_price_id = table.Column<Guid>(nullable: false),
                    invoice_id = table.Column<Guid>(nullable: false),
                    date = table.Column<DateTime>(nullable: false),
                    price = table.Column<decimal>(nullable: false),
                    investment_id = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investment_price", x => x.investment_price_id);
                    table.ForeignKey(
                        name: "fk_investment_price_investments_investment_id",
                        column: x => x.investment_id,
                        principalTable: "investments",
                        principalColumn: "investment_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_investment_price_invoices_invoice_id",
                        column: x => x.invoice_id,
                        principalTable: "invoices",
                        principalColumn: "invoice_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_investment_price_investment_id",
                table: "investment_price",
                column: "investment_id");

            migrationBuilder.CreateIndex(
                name: "ix_investment_price_invoice_id",
                table: "investment_price",
                column: "invoice_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "investment_price");
        }
    }
}
