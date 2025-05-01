using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.NotificationService.Dto
{
    public class CreateNotificationDto
    {
        [Required]
        [StringLength(200)]
        public string Message { get; set; }

        [Required]
        public NotificationType Type { get; set; }

        [Required]
        public long UserId { get; set; } // Recipient

        [Required]
        public string EntityType { get; set; }

        [Required]
        public Guid EntityId { get; set; }
    }
}
