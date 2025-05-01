using Mveledziso.Services.ActivitylogService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ActivitylogService
{
    public interface IActivityLogAppService
    {
        Task<ActivityLogDto> CreateAsync(CreateActivityLogDto input);
        Task<ActivityLogDto> UpdateAsync(Guid id, UpdateActivityLogDto input);
        Task DeleteAsync(Guid id);
        Task<ActivityLogDto> GetAsync(Guid id);
        Task<List<ActivityLogDto>> GetListAsync(ActivityLogListInputDto input);
    }
}
