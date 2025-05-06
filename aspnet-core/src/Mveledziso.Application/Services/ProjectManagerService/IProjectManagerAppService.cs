using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Services.ProjectManagerService.Dto;
using System;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectManagerService
{
    public interface IProjectManagerAppService : IAsyncCrudAppService<
        ProjectManagerDto,           // DTO for the ProjectManager
        Guid,                       // Primary key type
        GetProjectManagersInput,    // Used for paging/sorting
        CreateProjectManagerDto,    // Used for creating
        UpdateProjectManagerDto>    // Used for updating
    {
        Task<ProjectManagerDto> GetProjectManagerWithDetailsAsync(EntityDto<Guid> input);
    }
} 