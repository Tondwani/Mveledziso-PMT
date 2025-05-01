using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mveledziso.Migrations
{
    /// <inheritdoc />
    public partial class Add_Name_To_Timeline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Timelines",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Timelines");
        }
    }
}
