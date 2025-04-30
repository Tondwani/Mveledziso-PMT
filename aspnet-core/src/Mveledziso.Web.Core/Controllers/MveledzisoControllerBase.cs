using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Mveledziso.Controllers
{
    public abstract class MveledzisoControllerBase : AbpController
    {
        protected MveledzisoControllerBase()
        {
            LocalizationSourceName = MveledzisoConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
