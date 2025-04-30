using Abp.MultiTenancy;
using Mveledziso.Authorization.Users;

namespace Mveledziso.MultiTenancy;

public class Tenant : AbpTenant<User>
{
    public Tenant()
    {
    }

    public Tenant(string tenancyName, string name)
        : base(tenancyName, name)
    {
    }
}
