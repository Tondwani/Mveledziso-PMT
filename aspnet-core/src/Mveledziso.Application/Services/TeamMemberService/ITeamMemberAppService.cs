using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.TeamMemberService.Dto;
using System;
using System.Threading.Tasks;

namespace Mveledziso.Services.TeamMemberService
{
    public interface ITeamMemberAppService : IAsyncCrudAppService<
        TeamMemberDto,           
        Guid,                    
        GetTeamMembersInput,    
        CreateTeamMemberDto,     
        UpdateTeamMemberDto>     
    {
        Task<ListResultDto<TeamMemberDto>> GetTeamMembersByTeamAsync(EntityDto<Guid> input);
    }
} 