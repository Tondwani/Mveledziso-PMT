using Abp.Zero.EntityFrameworkCore;
using Mveledziso.Authorization.Roles;
using Mveledziso.Authorization.Users;
using Mveledziso.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace Mveledziso.EntityFrameworkCore;

public class MveledzisoDbContext : AbpZeroDbContext<Tenant, Role, User, MveledzisoDbContext>
{
    /* Define a DbSet for each entity of the application */

    public MveledzisoDbContext(DbContextOptions<MveledzisoDbContext> options)
        : base(options)
    {
    }
}
