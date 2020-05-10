using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class InvoiceCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "category_id",
                table: "invoice_line_items",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_invoice_line_items_category_id",
                table: "invoice_line_items",
                column: "category_id");

            migrationBuilder.AddForeignKey(
                name: "fk_invoice_line_items_categories_category_id",
                table: "invoice_line_items",
                column: "category_id",
                principalTable: "categories",
                principalColumn: "category_id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_invoice_line_items_categories_category_id",
                table: "invoice_line_items");

            migrationBuilder.DropIndex(
                name: "ix_invoice_line_items_category_id",
                table: "invoice_line_items");

            migrationBuilder.DropColumn(
                name: "category_id",
                table: "invoice_line_items");
        }
    }
}
