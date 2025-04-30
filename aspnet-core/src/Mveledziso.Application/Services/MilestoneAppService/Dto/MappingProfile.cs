using AutoMapper;
using Mveledziso.Domain.Entities;


namespace Mveledziso.Services.MilestoneAppService.Dto
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Milestone, MilestoneDto>();
            CreateMap<CreateMilestoneDto, Milestone>();
            CreateMap<UpdateMilestoneDto, Milestone>();
        }
    }
}
