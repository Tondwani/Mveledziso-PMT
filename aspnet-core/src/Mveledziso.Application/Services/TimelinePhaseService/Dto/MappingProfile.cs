using AutoMapper;
using Mveledziso.Domain.Entities;


namespace Mveledziso.Services.TimelinePhaseService.Dto
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TimelinePhase, TimelinePhaseDto>();
            CreateMap<CreateTimelinePhaseDto, TimelinePhase>();
            CreateMap<UpdateTimelinePhaseDto, TimelinePhase>();
        }

    }
}
