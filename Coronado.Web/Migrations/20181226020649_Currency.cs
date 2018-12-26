using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class Currency : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("029786a7-4a65-47bd-aa0b-30b864326eba"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("902f0ef0-aaee-45f3-8ad4-d12fbbd6c06c"));

            migrationBuilder.CreateTable(
                name: "currencies",
                columns: table => new
                {
                    symbol = table.Column<string>(nullable: false),
                    last_retrieved = table.Column<DateTime>(nullable: false),
                    price_in_usd = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_currencies", x => x.symbol);
                });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("cf22c203-1388-45a8-81d1-3e7d48521fd9"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("732205d4-e909-41da-9d77-b1b1f6e8dd6a"), "Bank Fees", null, "Expense" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "currencies");

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("732205d4-e909-41da-9d77-b1b1f6e8dd6a"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("cf22c203-1388-45a8-81d1-3e7d48521fd9"));

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("029786a7-4a65-47bd-aa0b-30b864326eba"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("902f0ef0-aaee-45f3-8ad4-d12fbbd6c06c"), "Bank Fees", null, "Expense" });
        }
    }
}
