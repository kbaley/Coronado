using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class CategoryParent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "parent_category_id",
                table: "categories",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_categories_parent_category_id",
                table: "categories",
                column: "parent_category_id");

            migrationBuilder.AddForeignKey(
                name: "fk_categories_categories_parent_category_id",
                table: "categories",
                column: "parent_category_id",
                principalTable: "categories",
                principalColumn: "category_id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_categories_categories_parent_category_id",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "ix_categories_parent_category_id",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "parent_category_id",
                table: "categories");
        }
    }
}
