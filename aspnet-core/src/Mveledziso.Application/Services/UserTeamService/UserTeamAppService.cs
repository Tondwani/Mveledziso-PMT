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
using Mveledziso.Services.UserTeamService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeamService
{
    public class UserTeamAppService : ApplicationService, IUserTeamAppService
    {
        private readonly IRepository<Domain.Entities.UserTeam, Guid> _userTeamRepository;
        private readonly IRepository<TeamMember, Guid> _teamMemberRepository;
        private readonly IRepository<Team, Guid> _teamRepository;
        private readonly IAsyncQueryableExecuter _asyncExecuter;

        public UserTeamAppService(
            IRepository<Domain.Entities.UserTeam, Guid> userTeamRepository,
            IRepository<TeamMember, Guid> teamMemberRepository,
            IRepository<Team, Guid> teamRepository,
            IAsyncQueryableExecuter asyncExecuter)
        {
            _userTeamRepository = userTeamRepository;
            _teamMemberRepository = teamMemberRepository;
            _teamRepository = teamRepository;
            _asyncExecuter = asyncExecuter;
        }

        public async Task<UserTeamDto> CreateAsync(CreateUserTeamDto input)
        {
            var teamMember = await _teamMemberRepository.GetAsync(input.TeamMemberId);
            if (teamMember == null)
            {
                throw new Abp.UI.UserFriendlyException(L("TeamMemberNotFound"));
            }

            var team = await _teamRepository.GetAsync(input.TeamId);
            if (team == null)
            {
                throw new Abp.UI.UserFriendlyException(L("TeamNotFound"));
            }

            var userTeam = new Domain.Entities.UserTeam
            {
                TeamMemberId = input.TeamMemberId,
                TeamId = input.TeamId,
                Role = input.Role
            };

            await _userTeamRepository.InsertAsync(userTeam);
            await CurrentUnitOfWork.SaveChangesAsync();
            
            return ObjectMapper.Map<UserTeamDto>(userTeam);
        }

        public async Task<UserTeamDto> UpdateAsync(Guid id, UpdateUserTeamDto input)
        {
            var userTeam = await _userTeamRepository.GetAsync(id);
            userTeam.Role = input.Role;
            await _userTeamRepository.UpdateAsync(userTeam);
            await CurrentUnitOfWork.SaveChangesAsync();
            
            return ObjectMapper.Map<UserTeamDto>(userTeam);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _userTeamRepository.DeleteAsync(id);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        public async Task<UserTeamDto> GetAsync(Guid id)
        {
            var userTeam = await _userTeamRepository.GetAsync(id);
            return ObjectMapper.Map<UserTeamDto>(userTeam);
        }

        public async Task<PagedResultDto<UserTeamDto>> GetListAsync(UserTeamListDto input)
        {
            var query = _userTeamRepository.GetAll()
                .WhereIf(input.TeamId.HasValue, ut => ut.TeamId == input.TeamId)
                .WhereIf(input.TeamMemberId.HasValue, ut => ut.TeamMemberId == input.TeamMemberId);

            var totalCount = await _asyncExecuter.CountAsync(query);
            var items = await _asyncExecuter.ToListAsync(
                query.OrderBy(input.Sorting ?? "CreationTime DESC")
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount)
            );

            return new PagedResultDto<UserTeamDto>
            {
                TotalCount = totalCount,
                Items = ObjectMapper.Map<List<UserTeamDto>>(items)
            };
        }
    }
}