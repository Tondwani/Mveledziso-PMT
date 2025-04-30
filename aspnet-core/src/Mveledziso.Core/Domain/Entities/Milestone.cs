using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Mveledziso.Domain.Entities
{
    [Table("Milestones")]
    public class Milestone : FullAuditedEntity<Guid>
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DateTime DueDate { get; set; }

        public bool IsCompleted { get; set; }

        public Guid TimelineId { get; set; }

        [ForeignKey("TimelineId")]
        public virtual Timeline Timeline { get; set; }

        public Milestone()
        {
            Id = Guid.NewGuid();
            IsCompleted = false;
        }
    }
}
