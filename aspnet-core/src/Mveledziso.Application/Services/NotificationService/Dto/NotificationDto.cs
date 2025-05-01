using Mveledziso.Domain.Enums;
using System;


namespace Mveledziso.Services.NotificationService.Dto
{
    public class NotificationDto
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public NotificationType Type { get; set; }
        public bool IsRead { get; set; }
        public long UserId { get; set; } // Recipient
        public string RecipientName { get; set; }
        public string EntityType { get; set; }
        public Guid EntityId { get; set; }
        public DateTime CreationTime { get; set; }
        public long SenderUserId { get; set; } // From CreationAuditedEntity
        public string SenderUserName { get; set; }
    }
}
