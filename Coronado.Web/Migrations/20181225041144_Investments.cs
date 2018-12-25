using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class Investments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("7a05a355-2b4c-4782-a0ca-b42a8eff8a5d"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("fe5eb5d0-8a50-442c-b015-e678d83517d3"));

            migrationBuilder.CreateTable(
                name: "investments",
                columns: table => new
                {
                    investment_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    symbol = table.Column<string>(nullable: true),
                    shares = table.Column<decimal>(nullable: false),
                    price = table.Column<decimal>(nullable: false),
                    url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investments", x => x.investment_id);
                });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("f39fc653-20ba-41ad-a5ad-cdde7de1cd6f"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("67b34150-2af0-452e-b094-8dea63539c0b"), "Bank Fees", null, "Expense" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "investments");

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("67b34150-2af0-452e-b094-8dea63539c0b"));

            migrationBuilder.DeleteData(
                table: "categories",
                keyColumn: "category_id",
                keyValue: new Guid("f39fc653-20ba-41ad-a5ad-cdde7de1cd6f"));

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("fe5eb5d0-8a50-442c-b015-e678d83517d3"), "Starting Balance", null, "Income" });

            migrationBuilder.InsertData(
                table: "categories",
                columns: new[] { "category_id", "name", "parent_category_id", "type" },
                values: new object[] { new Guid("7a05a355-2b4c-4782-a0ca-b42a8eff8a5d"), "Bank Fees", null, "Expense" });
        }
    }
}
