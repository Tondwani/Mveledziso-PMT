using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.ProjectManagerService.Dto;
using System;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectManagerService
{
    public interface IProjectManagerAppService : IAsyncCrudAppService<
        ProjectManagerDto,          
        Guid,                       
        GetProjectManagersInput,   
        CreateProjectManagerDto,    
        UpdateProjectManagerDto>    
    {
        Task<ProjectManagerDto> GetProjectManagerWithDetailsAsync(EntityDto<Guid> input);
    }
} 