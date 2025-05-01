using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Mveledziso.Authorization.Users;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.ActivitylogService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ActivitylogService
{
    public class ActivityLogAppService : ApplicationService, IActivityLogAppService
    {
        private readonly IRepository<ActivityLog, Guid> _activityLogRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IAbpSession _abpSession;

        public ActivityLogAppService(
            IRepository<ActivityLog, Guid> activityLogRepository,
            IRepository<User, long> userRepository,
            IAbpSession abpSession)
        {
            _activityLogRepository = activityLogRepository;
            _userRepository = userRepository;
            _abpSession = abpSession;
        }

        public async Task<ActivityLogDto> CreateAsync(CreateActivityLogDto input)
        {
            var log = new ActivityLog
            {
                Action = input.Action,
                Details = input.Details,
                UserId = _abpSession.UserId.Value,
                EntityType = input.EntityType,
                EntityId = input.EntityId
            };

            await _activityLogRepository.InsertAsync(log);
            return await GetAsync(log.Id);
        }

        public async Task<ActivityLogDto> UpdateAsync(Guid id, UpdateActivityLogDto input)
        {
            var log = await _activityLogRepository.GetAsync(id);
            log.Details = input.Details;

            await _activityLogRepository.UpdateAsync(log);
            return await GetAsync(id);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _activityLogRepository.DeleteAsync(id);
        }

        public async Task<ActivityLogDto> GetAsync(Guid id)
        {
            var log = await _activityLogRepository.GetAsync(id);
            var user = await _userRepository.GetAsync(log.UserId);

            return new ActivityLogDto
            {
                Id = log.Id,
                Action = log.Action,
                Details = log.Details,
                UserId = log.UserId,
                UserName = user.UserName,
                EntityType = log.EntityType,
                EntityId = log.EntityId,
                CreationTime = log.CreationTime
            };
        }

        public async Task<List<ActivityLogDto>> GetListAsync(ActivityLogListInputDto input)
        {
            var query = _activityLogRepository.GetAll()
                .WhereIf(input.UserId.HasValue, l => l.UserId == input.UserId)
                .WhereIf(!string.IsNullOrEmpty(input.Action), l => l.Action == input.Action)
                .WhereIf(!string.IsNullOrEmpty(input.EntityType), l => l.EntityType == input.EntityType)
                .WhereIf(input.EntityId.HasValue, l => l.EntityId == input.EntityId)
                .WhereIf(input.StartDate.HasValue, l => l.CreationTime >= input.StartDate)
                .WhereIf(input.EndDate.HasValue, l => l.CreationTime <= input.EndDate.Value.AddDays(1).AddTicks(-1))
                .OrderByDescending(l => l.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var logs = await Task.FromResult(query.ToList());
            var userIds = logs.Select(l => l.UserId).Distinct().ToList();
            var users = _userRepository.GetAll().Where(u => userIds.Contains(u.Id)).ToList();

            return logs.Select(l => new ActivityLogDto
            {
                Id = l.Id,
                Action = l.Action,
                Details = l.Details,
                UserId = l.UserId,
                UserName = users.FirstOrDefault(u => u.Id == l.UserId)?.UserName,
                EntityType = l.EntityType,
                EntityId = l.EntityId,
                CreationTime = l.CreationTime
            }).ToList();
        }
    }
}
