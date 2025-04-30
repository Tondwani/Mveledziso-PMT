using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Microsoft.Build.Evaluation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectService.Dto
{
    [AutoMapFrom(typeof(Project))]
    public class ProjectDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid TeamId { get; set; }
        public string TeamName { get; set; }
    }
}

