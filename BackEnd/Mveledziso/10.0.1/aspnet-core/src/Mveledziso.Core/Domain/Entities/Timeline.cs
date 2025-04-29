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

        [ForeignKey("ProjectId")]
        public virtual Project Project { get; set; }

        public Timeline()
        {
            Id = Guid.NewGuid();
        }
    }
}
