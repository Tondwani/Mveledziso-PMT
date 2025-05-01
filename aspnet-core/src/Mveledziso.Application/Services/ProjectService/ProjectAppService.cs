using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.ProjectService.Dto;

namespace Mveledziso.Services.ProjectService
{
    public class ProjectAppService :
        AsyncCrudAppService<Project, ProjectDto, Guid, GetProjectsInput, CreateProjectDto, UpdateProjectDto>,
        IProjectAppService
    {
        private readonly IRepository<Team, Guid> _teamRepository;

        public ProjectAppService(
            IRepository<Project, Guid> repository,
            IRepository<Team, Guid> teamRepository)
            : base(repository)
        {
            _teamRepository = teamRepository;
            LocalizationSourceName = "Mveledziso";
        }

        public override async Task<ProjectDto> CreateAsync(CreateProjectDto input)
        {
            // Validate team exists
            var team = await _teamRepository.FirstOrDefaultAsync(input.TeamId);
            if (team == null)
            {
                throw new UserFriendlyException(L("TeamNotFound", input.TeamId));
            }

            var project = ObjectMapper.Map<Project>(input);

            // Initialize timeline with required relationship
            project.Timeline = new Timeline
            {
                ProjectId = project.Id,
                Phases = new List<TimelinePhase>(),
                Milestones = new List<Milestone>()
            };

            await Repository.InsertAsync(project);
            await CurrentUnitOfWork.SaveChangesAsync();

            return await GetAsync(new EntityDto<Guid>(project.Id));
        }

        public async Task<ListResultDto<ProjectDto>> GetProjectsByTeamAsync(EntityDto<Guid> input)
        {
            var projects = await Repository.GetAllIncluding(p => p.Team)
                .Where(p => p.TeamId == input.Id)
                .ToListAsync();

            return new ListResultDto<ProjectDto>(
                ObjectMapper.Map<List<ProjectDto>>(projects)
            );
        }

        public async Task<ProjectDto> GetProjectWithDetailsAsync(EntityDto<Guid> input)
        {
            var project = await Repository.GetAllIncluding(
                    p => p.Team,
                    p => p.Duties,
                    p => p.Timeline)
                .FirstOrDefaultAsync(p => p.Id == input.Id);

            if (project == null)
            {
                throw new UserFriendlyException(L("ProjectNotFound", input.Id));
            }

            return ObjectMapper.Map<ProjectDto>(project);
        }

        protected override IQueryable<Project> CreateFilteredQuery(GetProjectsInput input)
        {
            return Repository.GetAllIncluding(p => p.Team)
                .WhereIf(!string.IsNullOrWhiteSpace(input.Filter),
                    p => p.Name.Contains(input.Filter) ||
                         p.Description.Contains(input.Filter))
                .WhereIf(input.TeamId.HasValue,
                    p => p.TeamId == input.TeamId.Value);
        }

        protected override async Task<Project> GetEntityByIdAsync(Guid id)
        {
            return await Repository.GetAllIncluding(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == id)
                ?? throw new UserFriendlyException(L("ProjectNotFound", id));
        }

        protected override void MapToEntity(UpdateProjectDto updateInput, Project entity)
        {
            // Validate date order
            if (updateInput.EndDate < updateInput.StartDate)
            {
                throw new UserFriendlyException(L("EndDateBeforeStartDateError"));
            }

            entity.Name = updateInput.Name;
            entity.Description = updateInput.Description;
            entity.StartDate = updateInput.StartDate;
            entity.EndDate = updateInput.EndDate;
            entity.IsCollaborationEnabled = updateInput.IsCollaborationEnabled;
        }

        protected override IQueryable<Project> ApplySorting(IQueryable<Project> query, GetProjectsInput input)
        {
            return input.Sorting switch
            {
                "name asc" => query.OrderBy(p => p.Name),
                "name desc" => query.OrderByDescending(p => p.Name),
                "startDate asc" => query.OrderBy(p => p.StartDate),
                "startDate desc" => query.OrderByDescending(p => p.StartDate),
                _ => query.OrderBy(p => p.CreationTime)
            };
        }
    }
}