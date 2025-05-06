using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.UserTeamService.Dto;
using System;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeamService
{
    public interface IUserTeamAppService : IApplicationService
    {
        Task<UserTeamDto> CreateAsync(CreateUserTeamDto input);
        Task<UserTeamDto> UpdateAsync(Guid id, UpdateUserTeamDto input);
        Task DeleteAsync(Guid id);
        Task<UserTeamDto> GetAsync(Guid id);
        Task<PagedResultDto<UserTeamDto>> GetListAsync(UserTeamListDto input);
    }
}
