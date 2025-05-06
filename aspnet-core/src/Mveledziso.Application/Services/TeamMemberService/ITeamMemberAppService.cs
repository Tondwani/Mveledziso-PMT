using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.TeamMemberService.Dto;
using System;
using System.Threading.Tasks;

namespace Mveledziso.Services.TeamMemberService
{
    public interface ITeamMemberAppService : IAsyncCrudAppService<
        TeamMemberDto,           // DTO for the TeamMember
        Guid,                    // Primary key type
        GetTeamMembersInput,    // Used for paging/sorting
        CreateTeamMemberDto,     // Used for creating
        UpdateTeamMemberDto>     // Used for updating
    {
        Task<ListResultDto<TeamMemberDto>> GetTeamMembersByTeamAsync(EntityDto<Guid> input);
    }
} 