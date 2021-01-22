using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class CurrencyHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "pk_currencies",
                table: "currencies");

            migrationBuilder.AlterColumn<string>(
                name: "symbol",
                table: "currencies",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<Guid>(
                name: "currency_id",
                table: "currencies",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "pk_currencies",
                table: "currencies",
                column: "currency_id");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_dividend_investment_id",
                table: "transactions",
                column: "dividend_investment_id");

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_investments_dividend_investment_id",
                table: "transactions",
                column: "dividend_investment_id",
                principalTable: "investments",
                principalColumn: "investment_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.Sql(@"
                update currencies
                set currency_id = uuid_generate_v4();
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transactions_investments_dividend_investment_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_dividend_investment_id",
                table: "transactions");

            migrationBuilder.DropPrimaryKey(
                name: "pk_currencies",
                table: "currencies");

            migrationBuilder.DropColumn(
                name: "currency_id",
                table: "currencies");

            migrationBuilder.AlterColumn<string>(
                name: "symbol",
                table: "currencies",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "pk_currencies",
                table: "currencies",
                column: "symbol");
        }
    }
}
