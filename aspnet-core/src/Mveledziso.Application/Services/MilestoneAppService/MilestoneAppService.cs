using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.MilestoneAppService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
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
            await CurrentUnitOfWork.SaveChangesAsync();

            // Now we can safely get the milestone
            var createdMilestone = await _milestoneRepository.GetAsync(milestone.Id);
            
            return new MilestoneDto
            {
                Id = createdMilestone.Id,
                Title = createdMilestone.Title,
                Description = createdMilestone.Description,
                DueDate = createdMilestone.DueDate,
                IsCompleted = createdMilestone.IsCompleted,
                TimelineId = createdMilestone.TimelineId,
                TimelineName = timeline.Name,
                CreationTime = createdMilestone.CreationTime
            };
        }

        public async Task<MilestoneDto> UpdateAsync(Guid id, UpdateMilestoneDto input)
        {
            var milestone = await _milestoneRepository.GetAsync(id);

            milestone.Title = input.Title;
            milestone.Description = input.Description;
            milestone.DueDate = input.DueDate;
            milestone.IsCompleted = input.IsCompleted;

            await _milestoneRepository.UpdateAsync(milestone);
            await CurrentUnitOfWork.SaveChangesAsync();
            
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

        public async Task DeleteAsync(Guid id)
        {
            await _milestoneRepository.DeleteAsync(id);
            await CurrentUnitOfWork.SaveChangesAsync();
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
            Logger.Info($"Getting milestones with TimelineId: {input.TimelineId}");

            var query = _milestoneRepository.GetAll();

            // Only filter by TimelineId if provided
            if (input.TimelineId != Guid.Empty)
            {
                query = query.Where(m => m.TimelineId == input.TimelineId);
            }

            // Filter by completion status if specified
            if (input.IsCompleted.HasValue)
            {
                query = query.Where(m => m.IsCompleted == input.IsCompleted.Value);
            }

            query = query.OrderBy(m => m.DueDate)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var milestones = await query.ToListAsync();
            
            Logger.Info($"Found {milestones.Count} milestones");

            if (!milestones.Any())
            {
                return new List<MilestoneDto>();
            }

            var timelineIds = milestones.Select(m => m.TimelineId).Distinct().ToList();
            var timelines = await _timelineRepository.GetAll()
                .Where(t => timelineIds.Contains(t.Id))
                .ToListAsync();

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
