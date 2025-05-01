

using AutoMapper;
using Mveledziso.Domain.Entities;

namespace Mveledziso.Services.ProjectDutiesService.Dto
{
    public class ProjectDutiesMappingProfile : Profile
    {
        public ProjectDutiesMappingProfile()
        {
            CreateMap<ProjectDuty, ProjectDutyDto>()
                .ForMember(dto => dto.ProjectName, opt => opt.MapFrom(src => src.Project != null ? src.Project.Name : null));

            CreateMap<CreateProjectDutyDto, ProjectDuty>();
            CreateMap<UpdateProjectDutyDto, ProjectDuty>();
        }
    }
}
