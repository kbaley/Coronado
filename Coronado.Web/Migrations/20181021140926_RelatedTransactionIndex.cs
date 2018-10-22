using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class RelatedTransactionIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_transactions_related_transaction_id",
                table: "transactions",
                column: "related_transaction_id");

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_transactions_related_transaction_id",
                table: "transactions",
                column: "related_transaction_id",
                principalTable: "transactions",
                principalColumn: "transaction_id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transactions_transactions_related_transaction_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_related_transaction_id",
                table: "transactions");
        }
    }
}
