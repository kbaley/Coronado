using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class BankFeeCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("5410fd5a-78f1-4422-a538-7b1915078d28"));

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("477a8dab-25ce-40a5-801d-d5212ae5cabf"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("b55bbc37-c2e3-427d-ab66-8f62180c4fa8"), "Bank Fees", null, "Expense" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("477a8dab-25ce-40a5-801d-d5212ae5cabf"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("b55bbc37-c2e3-427d-ab66-8f62180c4fa8"));

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("5410fd5a-78f1-4422-a538-7b1915078d28"), "Starting Balance", null, "Income" });
        }
    }
}
