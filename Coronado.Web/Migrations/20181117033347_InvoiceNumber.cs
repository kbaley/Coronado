using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class InvoiceNumber : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("4e5b18af-3e50-4922-a02c-08036fd3dbb4"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("6ae4aa6b-4af6-478f-bbbb-57a6e42bf96c"));

            migrationBuilder.AddColumn<string>(
                name: "invoice_number",
                table: "invoices",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("34a68d22-94b9-44db-ba85-723ba584703e"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("090b7359-1f60-4727-a109-f798d5fcfd11"), "Bank Fees", null, "Expense" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("090b7359-1f60-4727-a109-f798d5fcfd11"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("34a68d22-94b9-44db-ba85-723ba584703e"));

            migrationBuilder.DropColumn(
                name: "invoice_number",
                table: "invoices");

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("6ae4aa6b-4af6-478f-bbbb-57a6e42bf96c"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("4e5b18af-3e50-4922-a02c-08036fd3dbb4"), "Bank Fees", null, "Expense" });
        }
    }
}
