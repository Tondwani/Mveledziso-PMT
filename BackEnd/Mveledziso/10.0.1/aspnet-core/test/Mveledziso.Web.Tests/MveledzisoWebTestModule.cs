using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Mveledziso.EntityFrameworkCore;
using Mveledziso.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Mveledziso.Web.Tests;

[DependsOn(
    typeof(MveledzisoWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class MveledzisoWebTestModule : AbpModule
{
    public MveledzisoWebTestModule(MveledzisoEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(MveledzisoWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(MveledzisoWebMvcModule).Assembly);
    }
}