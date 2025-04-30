using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("Projects")]
    public class Project : FullAuditedEntity<Guid>
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public Guid TeamId { get; set; }

        public virtual Timeline Timeline { get; set; }

        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }

        public virtual ICollection<ProjectDuty> Duties { get; set; }

        public bool IsCollaborationEnabled { get; set; }

        public Project()
        {
            Id = Guid.NewGuid();
            Duties = new HashSet<ProjectDuty>();
            IsCollaborationEnabled = true;
        }
    }
}