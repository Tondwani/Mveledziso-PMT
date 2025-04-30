using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.ObjectMapping;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Domain.Entities;
using Mveledziso.Domain.Enums;
using Mveledziso.Services.ProjectDutiesService.Dto;

namespace Mveledziso.Services.ProjectDutiesService
{
    [AbpAuthorize]
    public class ProjectDutyAppService
        : AsyncCrudAppService<
            ProjectDuty,               
            ProjectDutyDto,            
            Guid,                      
            GetProjectDutiesInput,     
            CreateProjectDutyDto,      
            UpdateProjectDutyDto       
          >,
          IProjectDutyAppService
    {
        private readonly IRepository<Project, Guid> _projectRepository;

        public ProjectDutyAppService(
            IRepository<ProjectDuty, Guid> repository,
            IRepository<Project, Guid> projectRepository)
            : base(repository)
        {
            _projectRepository = projectRepository;
            LocalizationSourceName = "Mveledziso";
        }

        public override async Task<ProjectDutyDto> CreateAsync(CreateProjectDutyDto input)
        {
            
            CheckCreatePermission();

            // Validate parent project exists
            var project = await _projectRepository.FirstOrDefaultAsync(input.ProjectId);
            if (project == null)
            {
                throw new UserFriendlyException(L("Project Not Found"));
            }

            
            var duty = ObjectMapper.Map<ProjectDuty>(input);

            
            await Repository.InsertAsync(duty);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(duty);
        }

        public override async Task<ProjectDutyDto> UpdateAsync(UpdateProjectDutyDto input)
        {
            
            CheckUpdatePermission();

            var duty = await Repository.GetAsync(input.Id);

            // Map input into existing entity
            ObjectMapper.Map(input, duty);

            await Repository.UpdateAsync(duty);
            await CurrentUnitOfWork.SaveChangesAsync();

            return MapToEntityDto(duty);
        }

        public async Task<ListResultDto<ProjectDutyDto>> GetDutiesByProjectAsync(EntityDto<Guid> input)
        {
            // Validate parent project exists
            var project = await _projectRepository.FirstOrDefaultAsync(input.Id);
            if (project == null)
            {
                throw new UserFriendlyException(L("Project Not Found"));
            }

            var duties = await Repository.GetAllIncluding(d => d.Project)
                .Where(d => d.ProjectId == input.Id)
                .ToListAsync();

            var dutyDtos = ObjectMapper.Map<List<ProjectDutyDto>>(duties);

            return new ListResultDto<ProjectDutyDto>(dutyDtos);
        }

        public async Task UpdateStatusAsync(Guid id, DutyStatus status)
        {
            
            CheckUpdatePermission();

            var duty = await Repository.FirstOrDefaultAsync(id);
            if (duty == null)
            {
                throw new UserFriendlyException(L("Duty Not Found"));
            }

            duty.Status = status;
            await Repository.UpdateAsync(duty);
            await CurrentUnitOfWork.SaveChangesAsync();
        }

        protected override IQueryable<ProjectDuty> CreateFilteredQuery(GetProjectDutiesInput input)
        {
            return Repository.GetAllIncluding(d => d.Project)
                .WhereIf(!string.IsNullOrWhiteSpace(input.Filter),
                         d => d.Title.Contains(input.Filter) ||
                              d.Description.Contains(input.Filter))
                .WhereIf(input.ProjectId.HasValue, d => d.ProjectId == input.ProjectId)
                .WhereIf(input.Status.HasValue, d => d.Status == input.Status)
                .WhereIf(input.Priority.HasValue, d => d.Priority == input.Priority);
        }

        protected override async Task<ProjectDuty> GetEntityByIdAsync(Guid id)
        {
            return await Repository.GetAllIncluding(d => d.Project)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        protected override ProjectDutyDto MapToEntityDto(ProjectDuty entity)
        {
            var dto = base.MapToEntityDto(entity);
            dto.ProjectName = entity.Project?.Name;
            return dto;
        }
    }
}
