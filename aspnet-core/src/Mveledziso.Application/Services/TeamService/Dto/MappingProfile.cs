using AutoMapper;
using Mveledziso.Domain.Entities;


namespace Mveledziso.Services.TeamService.Dto
{
    public class TeamAppServiceMappingProfile : Profile
    {

        public TeamAppServiceMappingProfile()
        { 

        CreateMap<Team, TeamDto>()
            .ForMember(dto => dto.ProjectCount, opt => opt.MapFrom(src => src.Projects.Count));

        CreateMap<CreateTeamDto, Team>();
        CreateMap<UpdateTeamDto, Team>();

        }
    }
}
