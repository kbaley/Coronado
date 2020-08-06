using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class InvestmentPercentages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "category_id",
                table: "investments",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "investment_categories",
                columns: table => new
                {
                    investment_category_id = table.Column<Guid>(nullable: false),
                    name = table.Column<string>(nullable: true),
                    percentage = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_investment_categories", x => x.investment_category_id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_investments_category_id",
                table: "investments",
                column: "category_id");

            migrationBuilder.AddForeignKey(
                name: "fk_investments_investment_categories_category_id",
                table: "investments",
                column: "category_id",
                principalTable: "investment_categories",
                principalColumn: "investment_category_id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_investments_investment_categories_category_id",
                table: "investments");

            migrationBuilder.DropTable(
                name: "investment_categories");

            migrationBuilder.DropIndex(
                name: "ix_investments_category_id",
                table: "investments");

            migrationBuilder.DropColumn(
                name: "category_id",
                table: "investments");
        }
    }
}
