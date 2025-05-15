using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Mveledziso.Authorization.Users;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.NotificationService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.NotificationService
{
    public class NotificationAppService : ApplicationService, INotificationAppService
    {
        private readonly IRepository<AppNotification, Guid> _notificationRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IAbpSession _abpSession;

        public NotificationAppService(
            IRepository<AppNotification, Guid> notificationRepository,
            IRepository<User, long> userRepository,
            IAbpSession abpSession)
        {
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
            _abpSession = abpSession;
        }

        public async Task<NotificationDto> CreateAsync(CreateNotificationDto input)
        {
            // Validate recipient exists
            var recipient = await _userRepository.FirstOrDefaultAsync(input.UserId);
            if (recipient == null)
            {
                throw new UserFriendlyException("Recipient user not found!");
            }

            var notification = new AppNotification
            {
                Message = input.Message,
                Type = input.Type,
                UserId = input.UserId,
                EntityType = input.EntityType,
                EntityId = input.EntityId,
                CreatorUserId = _abpSession.UserId, // Sender = current user
                IsRead = false // Ensure new notifications start as unread
            };

            notification = await _notificationRepository.InsertAsync(notification);
            await CurrentUnitOfWork.SaveChangesAsync(); // Ensure changes are saved

            // Return DTO directly from created entity
            var sender = notification.CreatorUserId.HasValue ?
                await _userRepository.GetAsync(notification.CreatorUserId.Value) :
                null;

            return new NotificationDto
            {
                Id = notification.Id,
                Message = notification.Message,
                Type = notification.Type,
                IsRead = notification.IsRead,
                UserId = notification.UserId,
                RecipientName = recipient.UserName,
                EntityType = notification.EntityType,
                EntityId = notification.EntityId,
                CreationTime = notification.CreationTime,
                SenderUserId = notification.CreatorUserId ?? 0,
                SenderUserName = sender?.UserName
            };
        }

        public async Task<NotificationDto> UpdateAsync(Guid id, UpdateNotificationDto input)
        {
            var notification = await _notificationRepository.GetAsync(id);

            // Only allow updating IsRead status
            notification.IsRead = input.IsRead;

            await _notificationRepository.UpdateAsync(notification);
            return await GetAsync(id);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _notificationRepository.DeleteAsync(id);
        }

        public async Task<NotificationDto> GetAsync(Guid id)
        {
            var notification = await _notificationRepository.GetAsync(id);
            var recipient = await _userRepository.GetAsync(notification.UserId);
            var sender = notification.CreatorUserId.HasValue ?
                await _userRepository.GetAsync(notification.CreatorUserId.Value) :
                null;

            return new NotificationDto
            {
                Id = notification.Id,
                Message = notification.Message,
                Type = notification.Type,
                IsRead = notification.IsRead,
                UserId = notification.UserId,
                RecipientName = recipient.UserName,
                EntityType = notification.EntityType,
                EntityId = notification.EntityId,
                CreationTime = notification.CreationTime,
                SenderUserId = notification.CreatorUserId ?? 0,
                SenderUserName = sender?.UserName
            };
        }

        public async Task<List<NotificationDto>> GetListAsync(NotificationListInputDto input)
        {
            Logger.Info($"Getting notifications with UserId: {input.UserId}, IsRead: {input.IsRead}");

            var query = _notificationRepository.GetAll();

            // If no specific user is requested, use the current user's ID
            var userId = input.UserId > 0 ? input.UserId : _abpSession.UserId;
            
            if (userId.HasValue)
            {
                query = query.Where(n => n.UserId == userId.Value);
                Logger.Info($"Filtering for user: {userId.Value}");
            }
            else
            {
                Logger.Warn("No user ID provided or found in session");
                return new List<NotificationDto>();
            }

            if (input.IsRead.HasValue)
            {
                query = query.Where(n => n.IsRead == input.IsRead.Value);
                Logger.Info($"Filtering for IsRead: {input.IsRead.Value}");
            }

            query = query.OrderByDescending(n => n.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var notifications = await query.ToListAsync();
            Logger.Info($"Found {notifications.Count} notifications");

            if (!notifications.Any())
            {
                return new List<NotificationDto>();
            }

            var userIds = notifications
                .Select(n => n.UserId)
                .Concat(notifications.Where(n => n.CreatorUserId.HasValue)
                    .Select(n => n.CreatorUserId.Value))
                .Distinct()
                .ToList();

            Logger.Info($"Fetching user details for {userIds.Count} users");
            var users = await _userRepository.GetAll()
                .Where(u => userIds.Contains(u.Id))
                .ToListAsync();

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                Type = n.Type,
                IsRead = n.IsRead,
                UserId = n.UserId,
                RecipientName = users.FirstOrDefault(u => u.Id == n.UserId)?.UserName,
                EntityType = n.EntityType,
                EntityId = n.EntityId,
                CreationTime = n.CreationTime,
                SenderUserId = n.CreatorUserId ?? 0,
                SenderUserName = n.CreatorUserId.HasValue ?
                    users.FirstOrDefault(u => u.Id == n.CreatorUserId.Value)?.UserName :
                    null
            }).ToList();
        }

        public async Task<int> GetUnreadCountAsync()
        {
            var userId = _abpSession.UserId;
            if (!userId.HasValue)
            {
                Logger.Warn("No user ID found in session for GetUnreadCount");
                return 0;
            }

            return await _notificationRepository.GetAll()
                .Where(n => n.UserId == userId.Value && !n.IsRead)
                .CountAsync();
        }

        public async Task MarkAllAsReadAsync()
        {
            var userId = _abpSession.UserId;
            if (!userId.HasValue)
            {
                Logger.Warn("No user ID found in session for MarkAllAsRead");
                return;
            }

            var unreadNotifications = await _notificationRepository.GetAll()
                .Where(n => n.UserId == userId.Value && !n.IsRead)
                .ToListAsync();

            foreach (var notification in unreadNotifications)
            {
                notification.IsRead = true;
                await _notificationRepository.UpdateAsync(notification);
            }

            await CurrentUnitOfWork.SaveChangesAsync();
        }
    }
}
