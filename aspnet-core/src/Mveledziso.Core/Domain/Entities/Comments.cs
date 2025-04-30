using Abp.Domain.Entities.Auditing;
using Microsoft.Build.Framework;
using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace Mveledziso.Domain.Entities
{
    [Table("Comments")]
    public class Comment : FullAuditedEntity<Guid>
    {
        [Required]
        public string Content { get; set; }

        public long UserId { get; set; }

        // Polymorphic relationship to allow comments on different 
        // "Project", "ProjectDuty", etc
        public string EntityType { get; set; } 

        public Guid EntityId { get; set; }

    }
}
