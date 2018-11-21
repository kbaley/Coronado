using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class TransactionInvoiceRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "invoice_id",
                table: "transactions",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_transactions_invoice_id",
                table: "transactions",
                column: "invoice_id");

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_invoices_invoice_id",
                table: "transactions",
                column: "invoice_id",
                principalTable: "invoices",
                principalColumn: "invoice_id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transactions_invoices_invoice_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_invoice_id",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "invoice_id",
                table: "transactions");
        }
    }
}
