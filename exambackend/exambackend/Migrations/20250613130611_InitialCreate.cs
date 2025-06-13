using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace exambackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QCMs_Users_TeacherId",
                table: "QCMs");

            migrationBuilder.DropIndex(
                name: "IX_QCMs_TeacherId",
                table: "QCMs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_QCMs_TeacherId",
                table: "QCMs",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_QCMs_Users_TeacherId",
                table: "QCMs",
                column: "TeacherId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
