using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mveledziso.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSkillsAndUpdateRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Skills",
                schema: "mveledziso",
                table: "Persons");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Skills",
                schema: "mveledziso",
                table: "Persons",
                type: "text",
                nullable: true);
        }
    }
}
