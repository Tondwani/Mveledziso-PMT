using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mveledziso.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTeamMemberRoleToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // First, add a temporary column for the enum values
            migrationBuilder.AddColumn<int>(
                name: "RoleEnum",
                schema: "mveledziso",
                table: "Persons",
                type: "integer",
                nullable: true);

            // Convert existing string values to enum integers
            migrationBuilder.Sql(@"
                UPDATE mveledziso.""Persons""
                SET ""RoleEnum"" = CASE LOWER(""Role"")
                    WHEN 'member' THEN 0
                    WHEN 'projectmanager' THEN 1
                    WHEN 'teamlead' THEN 2
                    WHEN 'leader' THEN 3
                    WHEN 'viewer' THEN 4
                    WHEN 'admin' THEN 5
                    ELSE 0 -- Default to Member if unknown
                END
                WHERE ""PersonType"" = 'TeamMember';");

            // Drop the old string column
            migrationBuilder.DropColumn(
                name: "Role",
                schema: "mveledziso",
                table: "Persons");

            // Rename the new enum column to Role
            migrationBuilder.RenameColumn(
                name: "RoleEnum",
                schema: "mveledziso",
                table: "Persons",
                newName: "Role");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add back the string column
            migrationBuilder.AddColumn<string>(
                name: "RoleString",
                schema: "mveledziso",
                table: "Persons",
                type: "text",
                nullable: true);

            // Convert enum values back to strings
            migrationBuilder.Sql(@"
                UPDATE mveledziso.""Persons""
                SET ""RoleString"" = CASE ""Role""
                    WHEN 0 THEN 'Member'
                    WHEN 1 THEN 'ProjectManager'
                    WHEN 2 THEN 'TeamLead'
                    WHEN 3 THEN 'Leader'
                    WHEN 4 THEN 'Viewer'
                    WHEN 5 THEN 'Admin'
                    ELSE 'Member'
                END
                WHERE ""PersonType"" = 'TeamMember';");

            // Drop the enum column
            migrationBuilder.DropColumn(
                name: "Role",
                schema: "mveledziso",
                table: "Persons");

            // Rename string column back to Role
            migrationBuilder.RenameColumn(
                name: "RoleString",
                schema: "mveledziso",
                table: "Persons",
                newName: "Role");
        }
    }
}
