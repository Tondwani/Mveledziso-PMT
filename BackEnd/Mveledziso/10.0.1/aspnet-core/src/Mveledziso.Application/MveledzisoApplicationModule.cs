using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Mveledziso.Authorization;

namespace Mveledziso;

[DependsOn(
    typeof(MveledzisoCoreModule),
    typeof(AbpAutoMapperModule))]
public class MveledzisoApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<MveledzisoAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(MveledzisoApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
