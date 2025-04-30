using Abp.Authorization;
using Mveledziso.Authorization.Roles;
using Mveledziso.Authorization.Users;

namespace Mveledziso.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
