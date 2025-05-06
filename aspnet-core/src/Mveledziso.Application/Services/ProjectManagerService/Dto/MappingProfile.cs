using AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.ProjectService.Dto;

namespace Mveledziso.Services.ProjectManagerService.Dto
{
    public class ProjectManagerMapping : Profile
    {
        public ProjectManagerMapping()
        {
            CreateMap<ProjectManager, ProjectManagerDto>()
                .ForMember(dto => dto.ManagedProjects, opt => opt.MapFrom(src => src.ManagedProjects));
            CreateMap<CreateProjectManagerDto, ProjectManager>();
            CreateMap<UpdateProjectManagerDto, ProjectManager>();
        }
    }
} 