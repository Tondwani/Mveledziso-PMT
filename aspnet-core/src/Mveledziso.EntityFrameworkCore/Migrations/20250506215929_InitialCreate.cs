using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Mveledziso.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "mveledziso");

            migrationBuilder.CreateTable(
                name: "AbpAuditLogs",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    ServiceName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    MethodName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Parameters = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    ReturnValue = table.Column<string>(type: "text", nullable: true),
                    ExecutionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExecutionDuration = table.Column<int>(type: "integer", nullable: false),
                    ClientIpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    ClientName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    BrowserInfo = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    ExceptionMessage = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    Exception = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ImpersonatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    ImpersonatorTenantId = table.Column<int>(type: "integer", nullable: true),
                    CustomData = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpAuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpBackgroundJobs",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JobType = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    JobArgs = table.Column<string>(type: "character varying(1048576)", maxLength: 1048576, nullable: false),
                    TryCount = table.Column<short>(type: "smallint", nullable: false),
                    NextTryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastTryTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsAbandoned = table.Column<bool>(type: "boolean", nullable: false),
                    Priority = table.Column<byte>(type: "smallint", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpBackgroundJobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpDynamicProperties",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    DisplayName = table.Column<string>(type: "text", nullable: true),
                    InputType = table.Column<string>(type: "text", nullable: true),
                    Permission = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpDynamicProperties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpEditions",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpEditions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpEntityChangeSets",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BrowserInfo = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    ClientIpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    ClientName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExtensionData = table.Column<string>(type: "text", nullable: true),
                    ImpersonatorTenantId = table.Column<int>(type: "integer", nullable: true),
                    ImpersonatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    Reason = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpEntityChangeSets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpLanguages",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Icon = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    IsDisabled = table.Column<bool>(type: "boolean", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpLanguages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpLanguageTexts",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    LanguageName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Source = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Key = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Value = table.Column<string>(type: "text", maxLength: 67108864, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpLanguageTexts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpNotifications",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NotificationName = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: false),
                    Data = table.Column<string>(type: "character varying(1048576)", maxLength: 1048576, nullable: true),
                    DataTypeName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    EntityTypeName = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    EntityTypeAssemblyQualifiedName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    EntityId = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: true),
                    Severity = table.Column<byte>(type: "smallint", nullable: false),
                    UserIds = table.Column<string>(type: "character varying(131072)", maxLength: 131072, nullable: true),
                    ExcludedUserIds = table.Column<string>(type: "character varying(131072)", maxLength: 131072, nullable: true),
                    TenantIds = table.Column<string>(type: "character varying(131072)", maxLength: 131072, nullable: true),
                    TargetNotifiers = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpNotifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpNotificationSubscriptions",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    NotificationName = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: true),
                    EntityTypeName = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    EntityTypeAssemblyQualifiedName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    EntityId = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: true),
                    TargetNotifiers = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpNotificationSubscriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpOrganizationUnitRoles",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    OrganizationUnitId = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpOrganizationUnitRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpOrganizationUnits",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    ParentId = table.Column<long>(type: "bigint", nullable: true),
                    Code = table.Column<string>(type: "character varying(95)", maxLength: 95, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpOrganizationUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpOrganizationUnits_AbpOrganizationUnits_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpOrganizationUnits",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AbpTenantNotifications",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    NotificationName = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: false),
                    Data = table.Column<string>(type: "character varying(1048576)", maxLength: 1048576, nullable: true),
                    DataTypeName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    EntityTypeName = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    EntityTypeAssemblyQualifiedName = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    EntityId = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: true),
                    Severity = table.Column<byte>(type: "smallint", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpTenantNotifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserAccounts",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    UserLinkId = table.Column<long>(type: "bigint", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailAddress = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserAccounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserLoginAttempts",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    TenancyName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    UserNameOrEmailAddress = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ClientIpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    ClientName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    BrowserInfo = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Result = table.Column<byte>(type: "smallint", nullable: false),
                    FailReason = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserLoginAttempts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserNotifications",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    TenantNotificationId = table.Column<Guid>(type: "uuid", nullable: false),
                    State = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TargetNotifiers = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserNotifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserOrganizationUnits",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    OrganizationUnitId = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserOrganizationUnits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpUsers",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AuthenticationSource = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    EmailAddress = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Surname = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Password = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    EmailConfirmationCode = table.Column<string>(type: "character varying(328)", maxLength: 328, nullable: true),
                    PasswordResetCode = table.Column<string>(type: "character varying(328)", maxLength: 328, nullable: true),
                    LockoutEndDateUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false),
                    IsLockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    IsPhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    SecurityStamp = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    IsTwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    IsEmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NormalizedEmailAddress = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpUsers_AbpUsers_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpUsers_AbpUsers_DeleterUserId",
                        column: x => x.DeleterUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpUsers_AbpUsers_LastModifierUserId",
                        column: x => x.LastModifierUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AbpWebhookEvents",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebhookName = table.Column<string>(type: "text", nullable: false),
                    Data = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpWebhookEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpWebhookSubscriptions",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    WebhookUri = table.Column<string>(type: "text", nullable: false),
                    Secret = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Webhooks = table.Column<string>(type: "text", nullable: true),
                    Headers = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpWebhookSubscriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ActivityLogs",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Details = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppNotifications",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Message = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppNotifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Teams",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AbpDynamicEntityProperties",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EntityFullName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    DynamicPropertyId = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpDynamicEntityProperties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpDynamicEntityProperties_AbpDynamicProperties_DynamicProp~",
                        column: x => x.DynamicPropertyId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpDynamicProperties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpDynamicPropertyValues",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(type: "text", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    DynamicPropertyId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpDynamicPropertyValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpDynamicPropertyValues_AbpDynamicProperties_DynamicProper~",
                        column: x => x.DynamicPropertyId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpDynamicProperties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpFeatures",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Value = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Discriminator = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    EditionId = table.Column<int>(type: "integer", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpFeatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpFeatures_AbpEditions_EditionId",
                        column: x => x.EditionId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpEditions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpEntityChanges",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChangeTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ChangeType = table.Column<byte>(type: "smallint", nullable: false),
                    EntityChangeSetId = table.Column<long>(type: "bigint", nullable: false),
                    EntityId = table.Column<string>(type: "character varying(48)", maxLength: 48, nullable: true),
                    EntityTypeFullName = table.Column<string>(type: "character varying(192)", maxLength: 192, nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpEntityChanges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpEntityChanges_AbpEntityChangeSets_EntityChangeSetId",
                        column: x => x.EntityChangeSetId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpEntityChangeSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpRoles",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Description = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    IsStatic = table.Column<bool>(type: "boolean", nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    NormalizedName = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpRoles_AbpUsers_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpRoles_AbpUsers_DeleterUserId",
                        column: x => x.DeleterUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpRoles_AbpUsers_LastModifierUserId",
                        column: x => x.LastModifierUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AbpSettings",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpSettings_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AbpTenants",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TenancyName = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ConnectionString = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    EditionId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpTenants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpEditions_EditionId",
                        column: x => x.EditionId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpEditions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpUsers_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpUsers_DeleterUserId",
                        column: x => x.DeleterUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AbpTenants_AbpUsers_LastModifierUserId",
                        column: x => x.LastModifierUserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AbpUserClaims",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    ClaimType = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpUserClaims_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserLogins",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    LoginProvider = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ProviderKey = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserLogins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpUserLogins_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserRoles",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpUserRoles_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpUserTokens",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    LoginProvider = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Value = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    ExpireDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpUserTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpUserTokens_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Persons",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Password = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    PersonType = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    Role = table.Column<string>(type: "text", nullable: true),
                    Skills = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Persons_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AbpWebhookSendAttempts",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WebhookEventId = table.Column<Guid>(type: "uuid", nullable: false),
                    WebhookSubscriptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Response = table.Column<string>(type: "text", nullable: true),
                    ResponseStatusCode = table.Column<int>(type: "integer", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpWebhookSendAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpWebhookSendAttempts_AbpWebhookEvents_WebhookEventId",
                        column: x => x.WebhookEventId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpWebhookEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpDynamicEntityPropertyValues",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Value = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<string>(type: "text", nullable: true),
                    DynamicEntityPropertyId = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpDynamicEntityPropertyValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpDynamicEntityPropertyValues_AbpDynamicEntityProperties_D~",
                        column: x => x.DynamicEntityPropertyId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpDynamicEntityProperties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpEntityPropertyChanges",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EntityChangeId = table.Column<long>(type: "bigint", nullable: false),
                    NewValue = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    OriginalValue = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    PropertyName = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: true),
                    PropertyTypeFullName = table.Column<string>(type: "character varying(192)", maxLength: 192, nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    NewValueHash = table.Column<string>(type: "text", nullable: true),
                    OriginalValueHash = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpEntityPropertyChanges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpEntityPropertyChanges_AbpEntityChanges_EntityChangeId",
                        column: x => x.EntityChangeId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpEntityChanges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpPermissions",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    IsGranted = table.Column<bool>(type: "boolean", nullable: false),
                    Discriminator = table.Column<string>(type: "character varying(21)", maxLength: 21, nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<long>(type: "bigint", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpPermissions_AbpRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AbpPermissions_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AbpRoleClaims",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TenantId = table.Column<int>(type: "integer", nullable: true),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    ClaimType = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AbpRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbpRoleClaims_AbpRoles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "mveledziso",
                        principalTable: "AbpRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectManagerId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsCollaborationEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Persons_ProjectManagerId",
                        column: x => x.ProjectManagerId,
                        principalSchema: "mveledziso",
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Projects_Teams_TeamId",
                        column: x => x.TeamId,
                        principalSchema: "mveledziso",
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserTeams",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamMemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamId = table.Column<Guid>(type: "uuid", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTeams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTeams_Persons_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalSchema: "mveledziso",
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserTeams_Teams_TeamId",
                        column: x => x.TeamId,
                        principalSchema: "mveledziso",
                        principalTable: "Teams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectDuties",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    Deadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletionPercentage = table.Column<int>(type: "integer", nullable: false),
                    ActualStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectDuties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProjectDuties_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "mveledziso",
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Timelines",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Timelines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Timelines_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "mveledziso",
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FileUrl = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    ProjectDutyId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Documents_ProjectDuties_ProjectDutyId",
                        column: x => x.ProjectDutyId,
                        principalSchema: "mveledziso",
                        principalTable: "ProjectDuties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserDuties",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TeamMemberId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProjectDutyId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDuties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserDuties_Persons_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalSchema: "mveledziso",
                        principalTable: "Persons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserDuties_ProjectDuties_ProjectDutyId",
                        column: x => x.ProjectDutyId,
                        principalSchema: "mveledziso",
                        principalTable: "ProjectDuties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Milestones",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    TimelineId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Milestones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Milestones_Timelines_TimelineId",
                        column: x => x.TimelineId,
                        principalSchema: "mveledziso",
                        principalTable: "Timelines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimelinePhases",
                schema: "mveledziso",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimelineId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimelinePhases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimelinePhases_Timelines_TimelineId",
                        column: x => x.TimelineId,
                        principalSchema: "mveledziso",
                        principalTable: "Timelines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_TenantId_ExecutionDuration",
                schema: "mveledziso",
                table: "AbpAuditLogs",
                columns: new[] { "TenantId", "ExecutionDuration" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_TenantId_ExecutionTime",
                schema: "mveledziso",
                table: "AbpAuditLogs",
                columns: new[] { "TenantId", "ExecutionTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpAuditLogs_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpAuditLogs",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpBackgroundJobs_IsAbandoned_NextTryTime",
                schema: "mveledziso",
                table: "AbpBackgroundJobs",
                columns: new[] { "IsAbandoned", "NextTryTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicEntityProperties_DynamicPropertyId",
                schema: "mveledziso",
                table: "AbpDynamicEntityProperties",
                column: "DynamicPropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicEntityProperties_EntityFullName_DynamicPropertyId~",
                schema: "mveledziso",
                table: "AbpDynamicEntityProperties",
                columns: new[] { "EntityFullName", "DynamicPropertyId", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicEntityPropertyValues_DynamicEntityPropertyId",
                schema: "mveledziso",
                table: "AbpDynamicEntityPropertyValues",
                column: "DynamicEntityPropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicProperties_PropertyName_TenantId",
                schema: "mveledziso",
                table: "AbpDynamicProperties",
                columns: new[] { "PropertyName", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpDynamicPropertyValues_DynamicPropertyId",
                schema: "mveledziso",
                table: "AbpDynamicPropertyValues",
                column: "DynamicPropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChanges_EntityChangeSetId",
                schema: "mveledziso",
                table: "AbpEntityChanges",
                column: "EntityChangeSetId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChanges_EntityTypeFullName_EntityId",
                schema: "mveledziso",
                table: "AbpEntityChanges",
                columns: new[] { "EntityTypeFullName", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_TenantId_CreationTime",
                schema: "mveledziso",
                table: "AbpEntityChangeSets",
                columns: new[] { "TenantId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_TenantId_Reason",
                schema: "mveledziso",
                table: "AbpEntityChangeSets",
                columns: new[] { "TenantId", "Reason" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityChangeSets_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpEntityChangeSets",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpEntityPropertyChanges_EntityChangeId",
                schema: "mveledziso",
                table: "AbpEntityPropertyChanges",
                column: "EntityChangeId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpFeatures_EditionId_Name",
                schema: "mveledziso",
                table: "AbpFeatures",
                columns: new[] { "EditionId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpFeatures_TenantId_Name",
                schema: "mveledziso",
                table: "AbpFeatures",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpLanguages_TenantId_Name",
                schema: "mveledziso",
                table: "AbpLanguages",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpLanguageTexts_TenantId_Source_LanguageName_Key",
                schema: "mveledziso",
                table: "AbpLanguageTexts",
                columns: new[] { "TenantId", "Source", "LanguageName", "Key" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpNotificationSubscriptions_NotificationName_EntityTypeNam~",
                schema: "mveledziso",
                table: "AbpNotificationSubscriptions",
                columns: new[] { "NotificationName", "EntityTypeName", "EntityId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpNotificationSubscriptions_TenantId_NotificationName_Enti~",
                schema: "mveledziso",
                table: "AbpNotificationSubscriptions",
                columns: new[] { "TenantId", "NotificationName", "EntityTypeName", "EntityId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpOrganizationUnitRoles_TenantId_OrganizationUnitId",
                schema: "mveledziso",
                table: "AbpOrganizationUnitRoles",
                columns: new[] { "TenantId", "OrganizationUnitId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpOrganizationUnitRoles_TenantId_RoleId",
                schema: "mveledziso",
                table: "AbpOrganizationUnitRoles",
                columns: new[] { "TenantId", "RoleId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpOrganizationUnits_ParentId",
                schema: "mveledziso",
                table: "AbpOrganizationUnits",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpOrganizationUnits_TenantId_Code",
                schema: "mveledziso",
                table: "AbpOrganizationUnits",
                columns: new[] { "TenantId", "Code" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpPermissions_RoleId",
                schema: "mveledziso",
                table: "AbpPermissions",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpPermissions_TenantId_Name",
                schema: "mveledziso",
                table: "AbpPermissions",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpPermissions_UserId",
                schema: "mveledziso",
                table: "AbpPermissions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoleClaims_RoleId",
                schema: "mveledziso",
                table: "AbpRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoleClaims_TenantId_ClaimType",
                schema: "mveledziso",
                table: "AbpRoleClaims",
                columns: new[] { "TenantId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoles_CreatorUserId",
                schema: "mveledziso",
                table: "AbpRoles",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoles_DeleterUserId",
                schema: "mveledziso",
                table: "AbpRoles",
                column: "DeleterUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoles_LastModifierUserId",
                schema: "mveledziso",
                table: "AbpRoles",
                column: "LastModifierUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpRoles_TenantId_NormalizedName",
                schema: "mveledziso",
                table: "AbpRoles",
                columns: new[] { "TenantId", "NormalizedName" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpSettings_TenantId_Name_UserId",
                schema: "mveledziso",
                table: "AbpSettings",
                columns: new[] { "TenantId", "Name", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpSettings_UserId",
                schema: "mveledziso",
                table: "AbpSettings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenantNotifications_TenantId",
                schema: "mveledziso",
                table: "AbpTenantNotifications",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_CreatorUserId",
                schema: "mveledziso",
                table: "AbpTenants",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_DeleterUserId",
                schema: "mveledziso",
                table: "AbpTenants",
                column: "DeleterUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_EditionId",
                schema: "mveledziso",
                table: "AbpTenants",
                column: "EditionId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_LastModifierUserId",
                schema: "mveledziso",
                table: "AbpTenants",
                column: "LastModifierUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpTenants_TenancyName",
                schema: "mveledziso",
                table: "AbpTenants",
                column: "TenancyName");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_EmailAddress",
                schema: "mveledziso",
                table: "AbpUserAccounts",
                column: "EmailAddress");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_TenantId_EmailAddress",
                schema: "mveledziso",
                table: "AbpUserAccounts",
                columns: new[] { "TenantId", "EmailAddress" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpUserAccounts",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_TenantId_UserName",
                schema: "mveledziso",
                table: "AbpUserAccounts",
                columns: new[] { "TenantId", "UserName" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserAccounts_UserName",
                schema: "mveledziso",
                table: "AbpUserAccounts",
                column: "UserName");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserClaims_TenantId_ClaimType",
                schema: "mveledziso",
                table: "AbpUserClaims",
                columns: new[] { "TenantId", "ClaimType" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserClaims_UserId",
                schema: "mveledziso",
                table: "AbpUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLoginAttempts_TenancyName_UserNameOrEmailAddress_Res~",
                schema: "mveledziso",
                table: "AbpUserLoginAttempts",
                columns: new[] { "TenancyName", "UserNameOrEmailAddress", "Result" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLoginAttempts_UserId_TenantId",
                schema: "mveledziso",
                table: "AbpUserLoginAttempts",
                columns: new[] { "UserId", "TenantId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_ProviderKey_TenantId",
                schema: "mveledziso",
                table: "AbpUserLogins",
                columns: new[] { "ProviderKey", "TenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_TenantId_LoginProvider_ProviderKey",
                schema: "mveledziso",
                table: "AbpUserLogins",
                columns: new[] { "TenantId", "LoginProvider", "ProviderKey" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpUserLogins",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserLogins_UserId",
                schema: "mveledziso",
                table: "AbpUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserNotifications_UserId_State_CreationTime",
                schema: "mveledziso",
                table: "AbpUserNotifications",
                columns: new[] { "UserId", "State", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserOrganizationUnits_TenantId_OrganizationUnitId",
                schema: "mveledziso",
                table: "AbpUserOrganizationUnits",
                columns: new[] { "TenantId", "OrganizationUnitId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserOrganizationUnits_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpUserOrganizationUnits",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserRoles_TenantId_RoleId",
                schema: "mveledziso",
                table: "AbpUserRoles",
                columns: new[] { "TenantId", "RoleId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserRoles_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpUserRoles",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserRoles_UserId",
                schema: "mveledziso",
                table: "AbpUserRoles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_CreatorUserId",
                schema: "mveledziso",
                table: "AbpUsers",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_DeleterUserId",
                schema: "mveledziso",
                table: "AbpUsers",
                column: "DeleterUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_LastModifierUserId",
                schema: "mveledziso",
                table: "AbpUsers",
                column: "LastModifierUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_TenantId_NormalizedEmailAddress",
                schema: "mveledziso",
                table: "AbpUsers",
                columns: new[] { "TenantId", "NormalizedEmailAddress" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUsers_TenantId_NormalizedUserName",
                schema: "mveledziso",
                table: "AbpUsers",
                columns: new[] { "TenantId", "NormalizedUserName" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserTokens_TenantId_UserId",
                schema: "mveledziso",
                table: "AbpUserTokens",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AbpUserTokens_UserId",
                schema: "mveledziso",
                table: "AbpUserTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AbpWebhookSendAttempts_WebhookEventId",
                schema: "mveledziso",
                table: "AbpWebhookSendAttempts",
                column: "WebhookEventId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_EntityType_EntityId",
                schema: "mveledziso",
                table: "ActivityLogs",
                columns: new[] { "EntityType", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppNotifications_UserId",
                schema: "mveledziso",
                table: "AppNotifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_EntityType_EntityId",
                schema: "mveledziso",
                table: "Comments",
                columns: new[] { "EntityType", "EntityId" });

            migrationBuilder.CreateIndex(
                name: "IX_Documents_ProjectDutyId",
                schema: "mveledziso",
                table: "Documents",
                column: "ProjectDutyId");

            migrationBuilder.CreateIndex(
                name: "IX_Milestones_TimelineId",
                schema: "mveledziso",
                table: "Milestones",
                column: "TimelineId");

            migrationBuilder.CreateIndex(
                name: "IX_Persons_UserId",
                schema: "mveledziso",
                table: "Persons",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDuties_ProjectId",
                schema: "mveledziso",
                table: "ProjectDuties",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ProjectManagerId",
                schema: "mveledziso",
                table: "Projects",
                column: "ProjectManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_TeamId",
                schema: "mveledziso",
                table: "Projects",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_TimelinePhases_TimelineId",
                schema: "mveledziso",
                table: "TimelinePhases",
                column: "TimelineId");

            migrationBuilder.CreateIndex(
                name: "IX_Timelines_ProjectId",
                schema: "mveledziso",
                table: "Timelines",
                column: "ProjectId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserDuties_ProjectDutyId",
                schema: "mveledziso",
                table: "UserDuties",
                column: "ProjectDutyId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDuties_TeamMemberId",
                schema: "mveledziso",
                table: "UserDuties",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTeams_TeamId",
                schema: "mveledziso",
                table: "UserTeams",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTeams_TeamMemberId",
                schema: "mveledziso",
                table: "UserTeams",
                column: "TeamMemberId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AbpAuditLogs",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpBackgroundJobs",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpDynamicEntityPropertyValues",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpDynamicPropertyValues",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpEntityPropertyChanges",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpFeatures",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpLanguages",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpLanguageTexts",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpNotifications",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpNotificationSubscriptions",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpOrganizationUnitRoles",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpOrganizationUnits",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpPermissions",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpRoleClaims",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpSettings",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpTenantNotifications",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpTenants",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserAccounts",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserClaims",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserLoginAttempts",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserLogins",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserNotifications",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserOrganizationUnits",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserRoles",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUserTokens",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpWebhookSendAttempts",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpWebhookSubscriptions",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "ActivityLogs",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AppNotifications",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Comments",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Documents",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Milestones",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "TimelinePhases",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "UserDuties",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "UserTeams",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpDynamicEntityProperties",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpEntityChanges",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpRoles",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpEditions",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpWebhookEvents",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Timelines",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "ProjectDuties",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpDynamicProperties",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpEntityChangeSets",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Projects",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Persons",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "Teams",
                schema: "mveledziso");

            migrationBuilder.DropTable(
                name: "AbpUsers",
                schema: "mveledziso");
        }
    }
}
