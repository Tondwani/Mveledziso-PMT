using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectDutiesService.Dto
{
    [AutoMapFrom(typeof(ProjectDuty))]
    public class ProjectDutyDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DutyStatus Status { get; set; }
        public PriorityLevel Priority { get; set; }
        public DateTime? Deadline { get; set; }
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
