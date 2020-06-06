using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class AddTransactionCurrencyAmount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "amount_in_base_currency",
                table: "transactions",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.Sql("UPDATE transactions SET amount_in_base_currency = amount");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "amount_in_base_currency",
                table: "transactions");
        }
    }
}
