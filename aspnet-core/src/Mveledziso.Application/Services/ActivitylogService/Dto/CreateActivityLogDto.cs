using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ActivitylogService.Dto
{
    [AutoMapTo(typeof(ActivityLog))]
    public class CreateActivityLogDto
    {
        [Required]
        [StringLength(200)]
        public string Action { get; set; }

        [StringLength(500)]
        public string Details { get; set; }

        [Required]
        public string EntityType { get; set; }

        [Required]
        public Guid EntityId { get; set; }
    }
}
