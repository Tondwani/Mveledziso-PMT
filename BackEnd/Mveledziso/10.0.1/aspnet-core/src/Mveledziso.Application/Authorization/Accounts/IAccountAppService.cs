using Abp.Application.Services;
using Mveledziso.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace Mveledziso.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
