using AutoMapper;
using Mveledziso.Domain.Entities;

namespace Mveledziso.Services.TeamMemberService.Dto
{
    public class TeamMemberAppServiceMappingProfile : Profile
    {
        public TeamMemberAppServiceMappingProfile()
        {
            CreateMap<TeamMember, TeamMemberDto>();
            CreateMap<CreateTeamMemberDto, TeamMember>();
            CreateMap<UpdateTeamMemberDto, TeamMember>();
        }
    }
} 