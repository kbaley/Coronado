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

            migrationBuilder.Sql(@"
                UPDATE transactions SET transaction_type=0;
            ");

            migrationBuilder.Sql(@"
                UPDATE transactions SET transaction_type=1
                WHERE related_transaction_id IS NOT NULL;
            ");

            migrationBuilder.Sql(@"
                UPDATE transactions SET transaction_type=2
                WHERE invoice_id IS NOT NULL;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "transaction_type",
                table: "transactions");
        }
    }
}
