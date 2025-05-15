using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Authorization.Users;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.ActivitylogService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
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
            if (!_abpSession.UserId.HasValue)
            {
                throw new Abp.UI.UserFriendlyException("User must be logged in to create activity logs");
            }

            var currentUser = await _userRepository.GetAsync(_abpSession.UserId.Value);
            
            var log = new ActivityLog
            {
                Action = input.Action,
                Details = input.Details,
                UserId = _abpSession.UserId.Value,
                EntityType = input.EntityType,
                EntityId = input.EntityId
            };

            log = await _activityLogRepository.InsertAsync(log);
            await CurrentUnitOfWork.SaveChangesAsync();

            Logger.Info($"Created activity log: Action={log.Action}, EntityType={log.EntityType}, UserId={log.UserId}");

            return new ActivityLogDto
            {
                Id = log.Id,
                Action = log.Action,
                Details = log.Details,
                UserId = log.UserId,
                UserName = currentUser.UserName,
                EntityType = log.EntityType,
                EntityId = log.EntityId,
                CreationTime = log.CreationTime
            };
        }

        public async Task<ActivityLogDto> UpdateAsync(Guid id, UpdateActivityLogDto input)
        {
            var log = await _activityLogRepository.GetAsync(id);
            log.Details = input.Details;

            await _activityLogRepository.UpdateAsync(log);
            await CurrentUnitOfWork.SaveChangesAsync();
            
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

        public async Task DeleteAsync(Guid id)
        {
            await _activityLogRepository.DeleteAsync(id);
            await CurrentUnitOfWork.SaveChangesAsync();
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
            Logger.Info($"Getting activity logs with filters - UserId: {input.UserId}, EntityType: {input.EntityType}");

            var query = _activityLogRepository.GetAll();

            // Only apply the most important filters
            if (input.UserId.HasValue)
            {
                query = query.Where(l => l.UserId == input.UserId);
            }

            if (!string.IsNullOrEmpty(input.EntityType))
            {
                query = query.Where(l => l.EntityType == input.EntityType);
            }

            // Always order by creation time and apply paging
            query = query.OrderByDescending(l => l.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var logs = await query.ToListAsync();
            
            Logger.Info($"Found {logs.Count} activity logs");

            if (!logs.Any())
            {
                return new List<ActivityLogDto>();
            }

            var userIds = logs.Select(l => l.UserId).Distinct().ToList();
            var users = await _userRepository.GetAll()
                .Where(u => userIds.Contains(u.Id))
                .ToListAsync();

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
