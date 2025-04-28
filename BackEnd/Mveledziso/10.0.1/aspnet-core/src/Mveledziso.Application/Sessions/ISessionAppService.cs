using Abp.Application.Services;
using Mveledziso.Sessions.Dto;
using System.Threading.Tasks;

namespace Mveledziso.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
