using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class CustomerFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "city",
                table: "customers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "region",
                table: "customers",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "street_address",
                table: "customers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "city",
                table: "customers");

            migrationBuilder.DropColumn(
                name: "region",
                table: "customers");

            migrationBuilder.DropColumn(
                name: "street_address",
                table: "customers");
        }
    }
}
