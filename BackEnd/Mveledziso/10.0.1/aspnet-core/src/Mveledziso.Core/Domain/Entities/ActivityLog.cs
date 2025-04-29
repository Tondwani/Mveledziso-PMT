using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Entities
{
    [Table("ActivityLogs")]
    public class ActivityLog : CreationAuditedEntity<Guid>
    {
        [Required]
        [StringLength(200)]
        public string Action { get; set; }

        [StringLength(500)]
        public string Details { get; set; }

        public long UserId { get; set; } 

        public string EntityType { get; set; }

        public Guid EntityId { get; set; }

        public ActivityLog()
        {
            Id = Guid.NewGuid();
        }
    }
}
