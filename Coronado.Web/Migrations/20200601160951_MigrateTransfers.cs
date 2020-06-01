using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class MigrateTransfers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                INSERT INTO transfers (transfer_id, left_transaction_id, right_transaction_id)
                SELECT uuid_generate_v4(), transaction_id, related_transaction_id
                FROM transactions
                WHERE related_transaction_id IS NOT NULL;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM transfers");
        }
    }
}
