using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("Documents")]
    public class Document : CreationAuditedEntity<Guid>
    {
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }

        [Required]
        [StringLength(1000)]
        public string FileUrl { get; set; }

        public Guid ProjectDutyId { get; set; }

        [ForeignKey("ProjectDutyId")]
        public virtual ProjectDuty ProjectDuty { get; set; }

        public Document()
        {
            Id = Guid.NewGuid();
        }
    }
}