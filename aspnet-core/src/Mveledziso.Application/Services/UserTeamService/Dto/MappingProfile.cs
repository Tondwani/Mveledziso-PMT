using AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Authorization.Users;

namespace Mveledziso.Services.UserTeamService.Dto
{
    public class UserTeamMapping : Profile
    {
        public UserTeamMapping()
        {
            CreateMap<Domain.Entities.UserTeam, UserTeamDto>();
            CreateMap<CreateUserTeamDto, Domain.Entities.UserTeam>();
            CreateMap<UpdateUserTeamDto, Domain.Entities.UserTeam>();
        }
    }
}
