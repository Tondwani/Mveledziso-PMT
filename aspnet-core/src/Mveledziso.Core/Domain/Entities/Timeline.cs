using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Entities
{
    [Table("Timelines")]
    public class Timeline : FullAuditedEntity<Guid>
    {
        public Guid ProjectId { get; set; }
        public string Name { get; set; }

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }

        public virtual ICollection<TimelinePhase> Phases { get; set; }

        public virtual ICollection<Milestone> Milestones { get; set; }

        public Timeline()
        {
            Id = Guid.NewGuid();
            Milestones = new HashSet<Milestone>();
            Phases = new HashSet<TimelinePhase>();
        }
    }
}
