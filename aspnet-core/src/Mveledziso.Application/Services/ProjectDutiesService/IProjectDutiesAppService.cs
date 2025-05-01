using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Mveledziso.Domain.Enums;
using Mveledziso.Services.ProjectDutiesService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectDutiesService
{
    public interface IProjectDutyAppService : IAsyncCrudAppService<
        ProjectDutyDto,           
        Guid,                     
        GetProjectDutiesInput,     
        CreateProjectDutyDto,      
        UpdateProjectDutyDto>      
    {
        Task<ListResultDto<ProjectDutyDto>> GetDutiesByProjectAsync(EntityDto<Guid> input);
        Task UpdateStatusAsync(Guid id, DutyStatus status);
    }

}
