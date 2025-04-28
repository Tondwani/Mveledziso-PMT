using Abp.Modules;
using Abp.Reflection.Extensions;
using Mveledziso.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Mveledziso.Web.Host.Startup
{
    [DependsOn(
       typeof(MveledzisoWebCoreModule))]
    public class MveledzisoWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public MveledzisoWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MveledzisoWebHostModule).GetAssembly());
        }
    }
}
