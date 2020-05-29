using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class TransactionType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "transaction_type",
                table: "transactions",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "transaction_type",
                table: "transactions");
        }
    }
}
