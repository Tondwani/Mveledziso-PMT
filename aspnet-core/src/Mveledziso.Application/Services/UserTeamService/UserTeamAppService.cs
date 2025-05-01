using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using Abp.Collections.Extensions;
using AutoMapper.Internal.Mappers;
using Mveledziso.Authorization.Users;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.UserTeam.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeam
{
    public class UserTeamAppService : ApplicationService, IUserTeamAppService
    {
        private readonly IRepository<Domain.Entities.UserTeam, Guid> _userTeamRepository;
        private readonly IRepository<User, long> _userRepository; // ABP's User
        private readonly IRepository<Team, Guid> _teamRepository;
        private readonly IAsyncQueryableExecuter _asyncExecuter;

        public UserTeamAppService(
            IRepository<Domain.Entities.UserTeam, Guid> userTeamRepository,
            IRepository<User, long> userRepository,
            IRepository<Team, Guid> teamRepository,
            IAsyncQueryableExecuter asyncExecuter)
        {
            _userTeamRepository = userTeamRepository;
            _userRepository = userRepository;
            _teamRepository = teamRepository;
            _asyncExecuter = asyncExecuter;
        }

        public async Task<UserTeamDto> CreateAsync(CreateUserTeamDto input)
        {
            var userTeam = new Domain.Entities.UserTeam
            {
                UserId = input.UserId,
                TeamId = input.TeamId,
                Role = input.Role
            };

            await _userTeamRepository.InsertAsync(userTeam);
            var dto = new UserTeamDto();
            return ObjectMapper.Map(userTeam, dto);
        }

        public async Task<UserTeamDto> UpdateAsync(Guid id, UpdateUserTeamDto input)
        {
            var userTeam = await _userTeamRepository.GetAsync(id);
            userTeam.Role = input.Role;
            await _userTeamRepository.UpdateAsync(userTeam);
            var dto = new UserTeamDto();
            return ObjectMapper.Map(userTeam, dto);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _userTeamRepository.DeleteAsync(id);
        }

        public async Task<UserTeamDto> GetAsync(Guid id)
        {
            var userTeam = await _userTeamRepository.GetAsync(id);
            // Load additional details (User/Team names)
            var user = await _userRepository.GetAsync(userTeam.UserId);
            var team = await _teamRepository.GetAsync(userTeam.TeamId);
            var dto = new UserTeamDto();
            ObjectMapper.Map(userTeam, dto);
            dto.UserName = user.UserName;
            dto.TeamName = team.Name;
            return dto;
        }

        public async Task<PagedResultDto<UserTeamDto>> GetListAsync(UserTeamListDto input)
        {
            var query = _userTeamRepository.GetAll()
                .WhereIf(input.TeamId.HasValue, ut => ut.TeamId == input.TeamId)
                .WhereIf(input.UserId.HasValue, ut => ut.UserId == input.UserId);

            var totalCount = await _asyncExecuter.CountAsync(query);
            var items = await _asyncExecuter.ToListAsync(
                query.OrderBy(input.Sorting ?? "CreationTime DESC")
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount)
            );

            var dtos = new List<UserTeamDto>();
            ObjectMapper.Map(items, dtos);

            // Load User/Team names for all items
            foreach (var dto in dtos)
            {
                var user = await _userRepository.GetAsync(dto.UserId);
                var team = await _teamRepository.GetAsync(dto.TeamId);
                dto.UserName = user.UserName;
                dto.TeamName = team.Name;
            }

            return new PagedResultDto<UserTeamDto>(totalCount, dtos);
        }
    }
}