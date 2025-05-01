using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.MilestoneAppService.Dto
{
    public class MilestoneListInputDto
    {
        public Guid TimelineId { get; set; }
        public bool? IsCompleted { get; set; } 
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; } = 10;
    }
}
