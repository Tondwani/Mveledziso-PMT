using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectDutiesService.Dto
{
    [AutoMapTo(typeof(ProjectDuty))]
    public class UpdateProjectDutyDto : EntityDto<Guid>
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Title { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public DutyStatus Status { get; set; }

        public PriorityLevel Priority { get; set; }

        public DateTime? Deadline { get; set; }
    }
}
