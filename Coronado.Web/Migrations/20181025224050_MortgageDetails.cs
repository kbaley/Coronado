using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class MortgageDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "mortgage_payment",
                table: "accounts",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "mortgage_type",
                table: "accounts",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "mortgage_payment",
                table: "accounts");

            migrationBuilder.DropColumn(
                name: "mortgage_type",
                table: "accounts");
        }
    }
}
