using Mveledziso.Services.MilestoneAppService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.MilestoneAppService
{
    public interface IMilestoneAppService
    {
        Task<MilestoneDto> CreateAsync(CreateMilestoneDto input);
        Task<MilestoneDto> UpdateAsync(Guid id, UpdateMilestoneDto input);
        Task DeleteAsync(Guid id);
        Task<MilestoneDto> GetAsync(Guid id);
        Task<List<MilestoneDto>> GetListAsync(MilestoneListInputDto input);
    }
}
