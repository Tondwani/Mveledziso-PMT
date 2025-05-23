﻿using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.TimelinePhaseService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelinePhaseService
{
    public class TimelinePhaseAppService : ApplicationService, ITimelinePhaseAppService
    {
        private readonly IRepository<TimelinePhase, Guid> _phaseRepository;
        private readonly IRepository<Timeline, Guid> _timelineRepository;

        public TimelinePhaseAppService(
            IRepository<TimelinePhase, Guid> phaseRepository,
            IRepository<Timeline, Guid> timelineRepository)
        {
            _phaseRepository = phaseRepository;
            _timelineRepository = timelineRepository;
        }

        public async Task<TimelinePhaseDto> CreateAsync(CreateTimelinePhaseDto input)
        {
            // Validate timeline exists
            var timeline = await _timelineRepository.FirstOrDefaultAsync(input.TimelineId);
            if (timeline == null)
            {
                throw new UserFriendlyException("Timeline not found!");
            }

            // Validate date order
            if (input.StartDate >= input.EndDate)
            {
                throw new UserFriendlyException("End date must be after start date!");
            }

            var phase = new TimelinePhase
            {
                Name = input.Name,
                StartDate = input.StartDate,
                EndDate = input.EndDate,
                TimelineId = input.TimelineId
            };

            phase = await _phaseRepository.InsertAsync(phase);
            await CurrentUnitOfWork.SaveChangesAsync(); // Ensure changes are saved

            // Return DTO directly from created entity and already loaded timeline
            return new TimelinePhaseDto
            {
                Id = phase.Id,
                Name = phase.Name,
                StartDate = phase.StartDate,
                EndDate = phase.EndDate,
                TimelineId = phase.TimelineId,
                TimelineName = timeline.Name,
                CreationTime = phase.CreationTime
            };
        }

        public async Task<TimelinePhaseDto> UpdateAsync(Guid id, UpdateTimelinePhaseDto input)
        {
            var phase = await _phaseRepository.GetAsync(id);
            var timeline = await _timelineRepository.GetAsync(phase.TimelineId);

            if (input.StartDate >= input.EndDate)
            {
                throw new UserFriendlyException("End date must be after start date!");
            }

            phase.Name = input.Name;
            phase.StartDate = input.StartDate;
            phase.EndDate = input.EndDate;

            await _phaseRepository.UpdateAsync(phase);
            await CurrentUnitOfWork.SaveChangesAsync(); // Ensure changes are saved

            // Return DTO directly from updated entity and already loaded timeline
            return new TimelinePhaseDto
            {
                Id = phase.Id,
                Name = phase.Name,
                StartDate = phase.StartDate,
                EndDate = phase.EndDate,
                TimelineId = phase.TimelineId,
                TimelineName = timeline.Name,
                CreationTime = phase.CreationTime
            };
        }

        public async Task DeleteAsync(Guid id)
        {
            await _phaseRepository.DeleteAsync(id);
        }

        public async Task<TimelinePhaseDto> GetAsync(Guid id)
        {
            var phase = await _phaseRepository.GetAsync(id);
            var timeline = await _timelineRepository.GetAsync(phase.TimelineId);

            return new TimelinePhaseDto
            {
                Id = phase.Id,
                Name = phase.Name,
                StartDate = phase.StartDate,
                EndDate = phase.EndDate,
                TimelineId = phase.TimelineId,
                TimelineName = timeline.Name,
                CreationTime = phase.CreationTime
            };
        }

        public async Task<List<TimelinePhaseDto>> GetListAsync(TimelinePhaseListInputDto input)
        {
            Logger.Info($"Getting timeline phases with TimelineId: {input.TimelineId}");

            var query = _phaseRepository.GetAll();

            // Only filter by TimelineId if provided
            if (input.TimelineId != Guid.Empty)
            {
                query = query.Where(p => p.TimelineId == input.TimelineId);
            }

            query = query.OrderBy(p => p.StartDate)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var phases = await query.ToListAsync();
            
            Logger.Info($"Found {phases.Count} timeline phases");

            if (!phases.Any())
            {
                return new List<TimelinePhaseDto>();
            }

            var timelineIds = phases.Select(p => p.TimelineId).Distinct().ToList();
            var timelines = await _timelineRepository.GetAll()
                .Where(t => timelineIds.Contains(t.Id))
                .ToListAsync();

            return phases.Select(p => new TimelinePhaseDto
            {
                Id = p.Id,
                Name = p.Name,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                TimelineId = p.TimelineId,
                TimelineName = timelines.FirstOrDefault(t => t.Id == p.TimelineId)?.Name,
                CreationTime = p.CreationTime
            }).ToList();
        }
    }
}
