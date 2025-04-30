using AutoMapper;
using Mveledziso.Domain.Entities;

namespace Mveledziso.Services.ProjectService.Dto
{
    public class ProjectServiceMappingProfile : Profile
    {

        public ProjectServiceMappingProfile()
        {
            CreateMap<Project, ProjectDto>()
                .ForMember(dto => dto.TeamName, options => options.MapFrom(src => src.Team != null ? src.Team.Name : null));

            CreateMap<CreateProjectDto, Project>();
            CreateMap<UpdateProjectDto, Project>();

        }
    }

}
