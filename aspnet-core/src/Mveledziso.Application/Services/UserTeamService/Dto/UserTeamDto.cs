using Abp.Application.Services.Dto;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeamService.Dto
{
    public class UserTeamDto : AuditedEntityDto<Guid>
    {
        public Guid TeamMemberId { get; set; }
        public Guid TeamId { get; set; }
        public TeamRole Role { get; set; }
    }
}
