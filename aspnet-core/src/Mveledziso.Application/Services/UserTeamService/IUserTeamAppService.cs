using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.UserDutiesService.Dto;
using Mveledziso.Services.UserTeam.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeam
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
