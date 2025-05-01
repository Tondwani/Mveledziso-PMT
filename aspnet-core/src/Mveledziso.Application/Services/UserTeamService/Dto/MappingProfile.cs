using AutoMapper;
using Mveledziso.Services.UserTeam.Dto;

using Mveledziso.Authorization.Users;

namespace Mveledziso.Services.UserTeamService.Dto
{
    public class UserTeamMapping : Profile
    {
        public UserTeamMapping()
        {
            CreateMap<Domain.Entities.UserTeam, UserTeamDto>();
            CreateMap<CreateUserTeamDto, User>();
            CreateMap<UpdateUserTeamDto, Domain.Entities.UserTeam>();
        }
    }
}
