using Abp.Domain.Entities.Auditing;
using Microsoft.Build.Evaluation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("Teams")]
    public class Team : FullAuditedEntity<Guid>
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public virtual ICollection<Project> Projects { get; set; }

        public Team()
        {
            Id = Guid.NewGuid();
            Projects = new HashSet<Project>();
        }
    }
}