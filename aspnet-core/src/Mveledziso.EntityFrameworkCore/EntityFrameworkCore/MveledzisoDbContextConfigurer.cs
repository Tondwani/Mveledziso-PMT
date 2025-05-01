using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace Mveledziso.EntityFrameworkCore;

public static class MveledzisoDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<MveledzisoDbContext> builder, string connectionString)
    {
        builder.UseNpgsql(connectionString);
        //builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<MveledzisoDbContext> builder, DbConnection connection)
    {
        builder.UseNpgsql(connection);
        //builder.UseSqlServer(connection);
    }
}
