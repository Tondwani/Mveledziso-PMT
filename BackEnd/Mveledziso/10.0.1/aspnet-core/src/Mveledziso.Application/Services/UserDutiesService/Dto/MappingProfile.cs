using AutoMapper;
using Mveledziso.Domain.Entities;

namespace Mveledziso.Services.UserDutiesService.Dto
{
    public class UserDutyMappingProfile : Profile
    {
        public UserDutyMappingProfile()
        {
            CreateMap<UserDuty, UserDutyDto>();
            CreateMap<CreateUserDutyDto, UserDuty>();
            CreateMap<UpdateUserDutyDto, UserDuty>();
        }
    }
}
