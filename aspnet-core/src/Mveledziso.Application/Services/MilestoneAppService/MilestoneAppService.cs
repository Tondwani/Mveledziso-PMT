using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.MilestoneAppService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.MilestoneAppService
{
    public class MilestoneAppService : ApplicationService, IMilestoneAppService
    {
        private readonly IRepository<Milestone, Guid> _milestoneRepository;
        private readonly IRepository<Timeline, Guid> _timelineRepository;

        public MilestoneAppService(
            IRepository<Milestone, Guid> milestoneRepository,
            IRepository<Timeline, Guid> timelineRepository)
        {
            _milestoneRepository = milestoneRepository;
            _timelineRepository = timelineRepository;
        }

        public async Task<MilestoneDto> CreateAsync(CreateMilestoneDto input)
        {
            // Validate timeline exists
            var timeline = await _timelineRepository.FirstOrDefaultAsync(input.TimelineId);
            if (timeline == null)
            {
                throw new UserFriendlyException("Timeline not found!");
            }

            var milestone = new Milestone
            {
                Title = input.Title,
                Description = input.Description,
                DueDate = input.DueDate,
                TimelineId = input.TimelineId,
                IsCompleted = false // Default to not completed
            };

            await _milestoneRepository.InsertAsync(milestone);
            return await GetAsync(milestone.Id);
        }

        public async Task<MilestoneDto> UpdateAsync(Guid id, UpdateMilestoneDto input)
        {
            var milestone = await _milestoneRepository.GetAsync(id);

            milestone.Title = input.Title;
            milestone.Description = input.Description;
            milestone.DueDate = input.DueDate;
            milestone.IsCompleted = input.IsCompleted;

            await _milestoneRepository.UpdateAsync(milestone);
            return await GetAsync(id);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _milestoneRepository.DeleteAsync(id);
        }

        public async Task<MilestoneDto> GetAsync(Guid id)
        {
            var milestone = await _milestoneRepository.GetAsync(id);
            var timeline = await _timelineRepository.GetAsync(milestone.TimelineId);

            return new MilestoneDto
            {
                Id = milestone.Id,
                Title = milestone.Title,
                Description = milestone.Description,
                DueDate = milestone.DueDate,
                IsCompleted = milestone.IsCompleted,
                TimelineId = milestone.TimelineId,
                TimelineName = timeline.Name,
                CreationTime = milestone.CreationTime
            };
        }

        public async Task<List<MilestoneDto>> GetListAsync(MilestoneListInputDto input)
        {
            var query = _milestoneRepository.GetAll()
                .Where(m => m.TimelineId == input.TimelineId)
                .WhereIf(input.IsCompleted.HasValue, m => m.IsCompleted == input.IsCompleted)
                .OrderBy(m => m.DueDate)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var milestones = await Task.FromResult(query.ToList());
            var timelineIds = milestones.Select(m => m.TimelineId).Distinct().ToList();
            var timelines = _timelineRepository.GetAll().Where(t => timelineIds.Contains(t.Id)).ToList();

            return milestones.Select(m => new MilestoneDto
            {
                Id = m.Id,
                Title = m.Title,
                Description = m.Description,
                DueDate = m.DueDate,
                IsCompleted = m.IsCompleted,
                TimelineId = m.TimelineId,
                TimelineName = timelines.FirstOrDefault(t => t.Id == m.TimelineId)?.Name,
                CreationTime = m.CreationTime
            }).ToList();
        }
    }
}
