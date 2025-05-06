using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeamService.Dto
{
    public class UserTeamListDto : PagedAndSortedResultRequestDto
    {
        public Guid? TeamId { get; set; }
        public Guid? TeamMemberId { get; set; }
    }
}
