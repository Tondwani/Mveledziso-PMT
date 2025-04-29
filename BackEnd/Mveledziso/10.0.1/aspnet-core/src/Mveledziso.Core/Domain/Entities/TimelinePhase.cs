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
    [Table("TimelinePhases")]
    public class TimelinePhase : FullAuditedEntity<Guid>
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public Guid TimelineId { get; set; }

        [ForeignKey("TimelineId")]
        public virtual Timeline Timeline { get; set; }

        public TimelinePhase()
        {
            Id = Guid.NewGuid();
        }
    }
}
