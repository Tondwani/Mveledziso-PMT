using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Mveledziso.Configuration;
using Mveledziso.EntityFrameworkCore;
using Mveledziso.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace Mveledziso.Migrator;

[DependsOn(typeof(MveledzisoEntityFrameworkModule))]
public class MveledzisoMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public MveledzisoMigratorModule(MveledzisoEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(MveledzisoMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            MveledzisoConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(MveledzisoMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
