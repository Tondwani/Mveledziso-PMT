using Mveledziso.Configuration.Dto;
using System.Threading.Tasks;

namespace Mveledziso.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
