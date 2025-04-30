using Abp.AutoMapper;
using Microsoft.Build.Framework;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TimelineSrervice.Dto
{
    [AutoMapTo(typeof(Timeline))]
    public class CreateTimelineDto
    {
        [Required]
        public Guid ProjectId { get; set; }
    }
}
