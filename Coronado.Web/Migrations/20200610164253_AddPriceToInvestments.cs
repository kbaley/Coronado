using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class AddPriceToInvestments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "last_price",
                table: "investments",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "last_price_retrieval_date",
                table: "investments",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.Sql(@"
                update investments i
                set last_price = (
                    SELECT ip.price
                    FROM investment_prices ip
                    WHERE ip.investment_id = i.investment_id
                    ORDER BY date DESC
                    LIMIT 1
                ),
                last_price_retrieval_date = (
                    SELECT ip.date
                    FROM investment_prices ip
                    WHERE ip.investment_id = i.investment_id
                    ORDER BY date DESC
                    LIMIT 1
                )
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "last_price",
                table: "investments");

            migrationBuilder.DropColumn(
                name: "last_price_retrieval_date",
                table: "investments");
        }
    }
}
