using Mveledziso.Services.TimelinePhaseService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelinePhaseService
{
    public interface ITimelinePhaseAppService
    {
        Task<TimelinePhaseDto> CreateAsync(CreateTimelinePhaseDto input);
        Task<TimelinePhaseDto> UpdateAsync(Guid id, UpdateTimelinePhaseDto input);
        Task DeleteAsync(Guid id);
        Task<TimelinePhaseDto> GetAsync(Guid id);
        Task<List<TimelinePhaseDto>> GetListAsync(TimelinePhaseListInputDto input);
    }
}
