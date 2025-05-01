using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ActivitylogService.Dto
{
    [AutoMapFrom(typeof(ActivityLog))]
    public class ActivityLogDto
    {
        public Guid Id { get; set; }
        public string Action { get; set; }
        public string Details { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string EntityType { get; set; }
        public Guid EntityId { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
