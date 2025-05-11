using Mveledziso.Services.NotificationService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.NotificationService
{
    public interface INotificationAppService
    {
        Task<NotificationDto> CreateAsync(CreateNotificationDto input);
        Task<NotificationDto> UpdateAsync(Guid id, UpdateNotificationDto input);
        Task DeleteAsync(Guid id);
        Task<NotificationDto> GetAsync(Guid id);
        Task<List<NotificationDto>> GetListAsync(NotificationListInputDto input);
        Task<int> GetUnreadCountAsync();
        Task MarkAllAsReadAsync();
    }
}
