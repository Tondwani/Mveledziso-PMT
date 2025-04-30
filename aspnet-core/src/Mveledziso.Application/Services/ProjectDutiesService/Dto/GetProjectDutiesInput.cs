using Abp.Application.Services.Dto;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectDutiesService.Dto
{
    public class GetProjectDutiesInput : PagedResultRequestDto
    {
        public string Filter { get; set; }
        public Guid? ProjectId { get; set; }
        public DutyStatus? Status { get; set; }
        public PriorityLevel? Priority { get; set; }
    }
}
