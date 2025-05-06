using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("UserDuties")]
    public class UserDuty : CreationAuditedEntity<Guid>
    {
        public Guid TeamMemberId { get; set; }

        public Guid ProjectDutyId { get; set; }

        [ForeignKey("ProjectDutyId")]
        public virtual ProjectDuty ProjectDuty { get; set; }

        [ForeignKey("TeamMemberId")]
        public virtual TeamMember TeamMember { get; set; }

        public UserDuty()
        {
            Id = Guid.NewGuid();
        }
    }
}