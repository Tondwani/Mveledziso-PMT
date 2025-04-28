using Abp.MultiTenancy;
using Mveledziso.Editions;
using Mveledziso.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Mveledziso.EntityFrameworkCore.Seed.Tenants;

public class DefaultTenantBuilder
{
    private readonly MveledzisoDbContext _context;

    public DefaultTenantBuilder(MveledzisoDbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        CreateDefaultTenant();
    }

    private void CreateDefaultTenant()
    {
        // Default tenant

        var defaultTenant = _context.Tenants.IgnoreQueryFilters().FirstOrDefault(t => t.TenancyName == AbpTenantBase.DefaultTenantName);
        if (defaultTenant == null)
        {
            defaultTenant = new Tenant(AbpTenantBase.DefaultTenantName, AbpTenantBase.DefaultTenantName);

            var defaultEdition = _context.Editions.IgnoreQueryFilters().FirstOrDefault(e => e.Name == EditionManager.DefaultEditionName);
            if (defaultEdition != null)
            {
                defaultTenant.EditionId = defaultEdition.Id;
            }

            _context.Tenants.Add(defaultTenant);
            _context.SaveChanges();
        }
    }
}
