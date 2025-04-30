using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using AutoMapper.Internal.Mappers;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.TeamService.Dto;
using NuGet.Protocol.Core.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TeamService
{
    public class TeamAppService : AsyncCrudAppService<
        Team,            
        TeamDto,         
        Guid,            
        GetTeamsInput,   
        CreateTeamDto,   
        UpdateTeamDto    
    >, ITeamAppService
    {
        public TeamAppService(IRepository<Team, Guid> repository)
            : base(repository)
        {
            LocalizationSourceName = "Mveledziso";
        }

        public override async Task<TeamDto> CreateAsync(CreateTeamDto input)
        {
            CheckCreatePermission();

            // Check for duplicate team name
            var existingTeam = await Repository.FirstOrDefaultAsync(t => t.Name == input.Name);
            if (existingTeam != null)
            {
                throw new UserFriendlyException(L("TeamNameAlreadyExists"));
            }

            var team = ObjectMapper.Map<Team>(input);

            await Repository.InsertAsync(team);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(team);
        }

        public override async Task<TeamDto> UpdateAsync(UpdateTeamDto input)
        {
            CheckUpdatePermission();

            // Checks for duplicate team name (excluding current team)
            var existingTeam = await Repository.FirstOrDefaultAsync(t =>
                t.Name == input.Name && t.Id != input.Id);

            if (existingTeam != null)
            {
                throw new UserFriendlyException(L("TeamNameAlreadyExists"));
            }

            var team = await Repository.GetAsync(input.Id);

            ObjectMapper.Map(input, team);

            await Repository.UpdateAsync(team);

            return MapToEntityDto(team);
        }

        protected override IQueryable<Team> CreateFilteredQuery(GetTeamsInput input)
        {
            return Repository.GetAll()
                .WhereIf(!string.IsNullOrWhiteSpace(input.Filter),
                    t => t.Name.Contains(input.Filter) ||
                         t.Description.Contains(input.Filter));
        }

        protected override async Task<Team> GetEntityByIdAsync(Guid id)
        {
            return await Repository.GetAllIncluding(t => t.Projects)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        protected override TeamDto MapToEntityDto(Team entity)
        {
            var teamDto = base.MapToEntityDto(entity);

            teamDto.ProjectCount = entity.Projects?.Count ?? 0;

            return teamDto;
        }
    }
}
