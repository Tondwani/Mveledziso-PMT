using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ActivitylogService.Dto
{
    public class ActivityLogListInputDto
    {
        public long? UserId { get; set; }
        public string Action { get; set; }
        public string EntityType { get; set; }
        public Guid? EntityId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; } = 10;
    }
}
