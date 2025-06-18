using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace exambackend.Migrations
{
    /// <inheritdoc />
    public partial class AddNavigationToResponse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "Responses",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_QCMId",
                table: "Responses",
                column: "QCMId");

            migrationBuilder.CreateIndex(
                name: "IX_Responses_StudentId",
                table: "Responses",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Responses_QCMs_QCMId",
                table: "Responses",
                column: "QCMId",
                principalTable: "QCMs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Responses_Users_StudentId",
                table: "Responses",
                column: "StudentId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Responses_QCMs_QCMId",
                table: "Responses");

            migrationBuilder.DropForeignKey(
                name: "FK_Responses_Users_StudentId",
                table: "Responses");

            migrationBuilder.DropIndex(
                name: "IX_Responses_QCMId",
                table: "Responses");

            migrationBuilder.DropIndex(
                name: "IX_Responses_StudentId",
                table: "Responses");

            migrationBuilder.AlterColumn<string>(
                name: "StudentId",
                table: "Responses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
