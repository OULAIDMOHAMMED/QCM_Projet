using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace exambackend.Migrations
{
    /// <inheritdoc />
    public partial class AddQCMAndQuestionEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QCMs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TeacherId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QCMs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QCMs_Users_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Answers = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorrectIndexes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QCMId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_QCMs_QCMId",
                        column: x => x.QCMId,
                        principalTable: "QCMs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_QCMs_TeacherId",
                table: "QCMs",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_QCMId",
                table: "Questions",
                column: "QCMId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "QCMs");
        }
    }
}
