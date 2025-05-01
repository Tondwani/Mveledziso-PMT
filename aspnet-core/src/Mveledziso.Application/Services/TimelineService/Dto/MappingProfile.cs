using AutoMapper;
using Mveledziso.Domain.Entities;

namespace Mveledziso.Services.TimelineSrervice.Dto
{
    public class TimelineMappingProfile : Profile
    {
        public TimelineMappingProfile()
        {
            CreateMap<Timeline, TimelineDto>();
            CreateMap<CreateTimelineDto, Timeline>();
            CreateMap<UpdateTimelineDto, Timeline>();
        }
    }
}
