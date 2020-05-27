using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class InvestmentTransactionReference : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "transaction_id",
                table: "investment_transactions",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_investment_transactions_transaction_id",
                table: "investment_transactions",
                column: "transaction_id");

            migrationBuilder.AddForeignKey(
                name: "fk_investment_transactions_transactions_transaction_id",
                table: "investment_transactions",
                column: "transaction_id",
                principalTable: "transactions",
                principalColumn: "transaction_id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_investment_transactions_transactions_transaction_id",
                table: "investment_transactions");

            migrationBuilder.DropIndex(
                name: "ix_investment_transactions_transaction_id",
                table: "investment_transactions");

            migrationBuilder.DropColumn(
                name: "transaction_id",
                table: "investment_transactions");
        }
    }
}
