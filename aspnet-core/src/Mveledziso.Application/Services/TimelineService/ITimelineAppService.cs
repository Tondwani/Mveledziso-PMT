using Abp.Application.Services;
using Mveledziso.Services.TimelineSrervice.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelineSrervice
{
    public interface ITimelineAppService : IAsyncCrudAppService<TimelineDto, Guid, GetTimelineInput, CreateTimelineDto, UpdateTimelineDto>
    {
    }
}
