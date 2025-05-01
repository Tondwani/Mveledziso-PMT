using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelinePhaseService.Dto
{
    [AutoMapFrom(typeof(TimelinePhase))]
    public class TimelinePhaseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public Guid TimelineId { get; set; }
        public string TimelineName { get; set; } 
        public DateTime CreationTime { get; set; }
    }
}
