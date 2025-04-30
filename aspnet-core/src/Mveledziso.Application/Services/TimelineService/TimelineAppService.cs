using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.TimelineSrervice.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelineSrervice
{
    public class TimelineAppService : AsyncCrudAppService<Timeline, TimelineDto, Guid, GetTimelineInput, CreateTimelineDto, UpdateTimelineDto>, ITimelineAppService
    {
        private readonly IRepository<Timeline, Guid> _timelineRepository;

        public TimelineAppService(IRepository<Timeline, Guid> timelineRepository)
            : base(timelineRepository)
        {
            _timelineRepository = timelineRepository;
        }

        protected override IQueryable<Timeline> CreateFilteredQuery(GetTimelineInput input)
        {
            return _timelineRepository.GetAll()
                .WhereIf(input.ProjectId.HasValue, x => x.ProjectId == input.ProjectId.Value)
                .WhereIf(input.FromDate.HasValue, x => x.CreationTime >= input.FromDate.Value)
                .WhereIf(input.ToDate.HasValue, x => x.CreationTime <= input.ToDate.Value.AddDays(1).AddTicks(-1))
                .WhereIf(input.IsDeleted.HasValue, x => x.IsDeleted == input.IsDeleted.Value);
        }

        protected override IQueryable<Timeline> ApplySorting(IQueryable<Timeline> query, GetTimelineInput input)
        {
            return query.OrderByDescending(x => x.CreationTime);
        }
    }
}
