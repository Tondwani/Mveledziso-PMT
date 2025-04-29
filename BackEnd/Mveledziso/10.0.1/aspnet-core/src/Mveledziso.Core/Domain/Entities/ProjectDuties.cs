using Abp.Domain.Entities.Auditing;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("ProjectDuties")]
    public class ProjectDuty : FullAuditedEntity<Guid>
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DutyStatus Status { get; set; }

        public PriorityLevel Priority { get; set; }

        public DateTime? Deadline { get; set; }

        public int CompletionPercentage { get; set; }

        public DateTime? ActualStartDate { get; set; }

        public DateTime? ActualEndDate { get; set; }

        public Guid ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }

        public virtual ICollection<UserDuty> UserDuties { get; set; }

        public virtual ICollection<Document> Documents { get; set; }

        public ProjectDuty()
        {
            Id = Guid.NewGuid();
            Status = DutyStatus.ToDo;
            Priority = PriorityLevel.Medium;
            UserDuties = new HashSet<UserDuty>();
            Documents = new HashSet<Document>();
            CompletionPercentage = 0;
        }
    }
}