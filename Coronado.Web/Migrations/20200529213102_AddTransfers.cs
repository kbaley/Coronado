using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coronado.Web.Migrations
{
    public partial class AddTransfers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "transfers",
                columns: table => new
                {
                    transfer_id = table.Column<Guid>(nullable: false),
                    left_transaction_id = table.Column<Guid>(nullable: false),
                    right_transaction_id = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_transfers", x => x.transfer_id);
                    table.ForeignKey(
                        name: "fk_transfers_transactions_left_transaction_id",
                        column: x => x.left_transaction_id,
                        principalTable: "transactions",
                        principalColumn: "transaction_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_transfers_transactions_right_transaction_id",
                        column: x => x.right_transaction_id,
                        principalTable: "transactions",
                        principalColumn: "transaction_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_transfers_left_transaction_id",
                table: "transfers",
                column: "left_transaction_id");

            migrationBuilder.CreateIndex(
                name: "ix_transfers_right_transaction_id",
                table: "transfers",
                column: "right_transaction_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "transfers");
        }
    }
}
