using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class InvestmentTransactions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "price",
                table: "investments");

            migrationBuilder.DropColumn(
                name: "url",
                table: "investments");

            migrationBuilder.RenameIndex(
                name: "ix_investment_price_investment_id",
                table: "investment_prices",
                newName: "ix_investment_prices_investment_id");

            migrationBuilder.AddColumn<decimal>(
                name: "average_price",
                table: "investments",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "investment_transactions",
                columns: table => new
                {
                    investment_transaction_id = table.Column<Guid>(nullable: false),
                    investment_id = table.Column<Guid>(nullable: false),
                    shares = table.Column<decimal>(nullable: false),
                    price = table.Column<decimal>(nullable: false),
                    date = table.Column<DateTime>(nullable: false)
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
                });

            migrationBuilder.CreateIndex(
                name: "ix_investment_transactions_investment_id",
                table: "investment_transactions",
                column: "investment_id");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_investment_prices_investments_investment_id",
                table: "investment_prices");

            migrationBuilder.DropTable(
                name: "investment_transactions");

            migrationBuilder.DropColumn(
                name: "average_price",
                table: "investments");

            migrationBuilder.AddColumn<decimal>(
                name: "price",
                table: "investments",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "url",
                table: "investments",
                type: "text",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "fk_investment_price_investments_investment_id",
                table: "investment_price",
                column: "investment_id",
                principalTable: "investments",
                principalColumn: "investment_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
