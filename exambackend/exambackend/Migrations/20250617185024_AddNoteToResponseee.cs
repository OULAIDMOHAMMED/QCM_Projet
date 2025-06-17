using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace exambackend.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteToResponseee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Note",
                table: "Responses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Responses");
        }
    }
}
