using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserDutiesService.Dto
{
    public class GetUserDutyInput : PagedResultRequestDto
    {
        public Guid? TeamMemberId { get; set; }
        public Guid? ProjectDutyId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
