using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.MilestoneAppService.Dto
{
    public class MilestoneDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public Guid TimelineId { get; set; }
        public string TimelineName { get; set; } 
        public DateTime CreationTime { get; set; }
    }
}
