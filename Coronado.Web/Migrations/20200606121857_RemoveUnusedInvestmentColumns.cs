using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class RemoveUnusedInvestmentColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "average_price",
                table: "investments");

            migrationBuilder.DropColumn(
                name: "last_retrieved",
                table: "investments");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "average_price",
                table: "investments",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "last_retrieved",
                table: "investments",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
