using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Mveledziso.Domain.Enums;

namespace Mveledziso.Domain.Entities
{
    [Table("Notifications")]
    public class Notification : CreationAuditedEntity<Guid>
    {
        [Required]
        [StringLength(200)]
        public string Message { get; set; }

         public NotificationType Type { get; set; }

        public bool IsRead { get; set; }

        public long UserId { get; set; } // Recipient

        // Reference to the related entity
        public string EntityType { get; set; }

        public Guid EntityId { get; set; }

        public Notification()
        {
            Id = Guid.NewGuid();
            IsRead = false;
        }
    }

}
