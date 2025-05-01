using Abp.Application.Services.Dto;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeam.Dto
{
    public class UserTeamDto : AuditedEntityDto<Guid>
    {
        public long UserId { get; set; }
        public string UserName { get; set; } 
        public Guid TeamId { get; set; }
        public string TeamName { get; set; } 
        public TeamRole Role { get; set; }
    }
}
