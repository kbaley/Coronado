using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class CombineDebitCreditCols : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "credit",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "debit",
                table: "transactions");

            migrationBuilder.AddColumn<decimal>(
                name: "amount",
                table: "transactions",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "amount",
                table: "transactions");

            migrationBuilder.AddColumn<decimal>(
                name: "credit",
                table: "transactions",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "debit",
                table: "transactions",
                nullable: true);
        }
    }
}
