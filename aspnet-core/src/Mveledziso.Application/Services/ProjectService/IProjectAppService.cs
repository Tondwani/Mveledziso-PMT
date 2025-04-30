using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.ProjectService.Dto;
using System;
using System.Threading.Tasks;

public interface IProjectAppService
    : IAsyncCrudAppService<
        ProjectDto,       
        Guid,             
        GetProjectsInput, 
        CreateProjectDto, 
        UpdateProjectDto  
      >
{
    Task<ListResultDto<ProjectDto>> GetProjectsByTeamAsync(EntityDto<Guid> input);
    Task<ProjectDto> GetProjectWithDetailsAsync(EntityDto<Guid> input);
}
