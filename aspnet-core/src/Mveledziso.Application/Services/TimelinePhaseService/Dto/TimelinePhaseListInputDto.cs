using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelinePhaseService.Dto
{
    public class TimelinePhaseListInputDto
    {
        public Guid TimelineId { get; set; }
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; } = 10;
    }
}
