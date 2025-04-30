using Abp.Authorization;
using Abp.Runtime.Session;
using Mveledziso.Configuration.Dto;
using System.Threading.Tasks;

namespace Mveledziso.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : MveledzisoAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
