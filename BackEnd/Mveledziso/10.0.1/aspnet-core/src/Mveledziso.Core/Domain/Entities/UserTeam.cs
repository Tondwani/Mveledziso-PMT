using Abp.Domain.Entities.Auditing;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Domain.Entities
{
    [Table("UserTeams")]
    public class UserTeam : CreationAuditedEntity<Guid>
    {
        public long UserId { get; set; }

        public Guid TeamId { get; set; }

        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }

        public TeamRole Role { get; set; }

        public UserTeam()
        {
            Id = Guid.NewGuid();
            Role = TeamRole.Member; 
        }
    }
}
