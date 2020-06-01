using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class RemoveRelatedTransactionId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transactions_transactions_related_transaction_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_related_transaction_id",
                table: "transactions");
            
            migrationBuilder.DropColumn(
                name: "related_transaction_id",
                table: "transactions");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "related_transaction_id",
                table: "transactions",
                nullable: true);
                
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
    }
}
