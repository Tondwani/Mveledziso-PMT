using Abp.Application.Services.Dto;
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
    [AutoMap(typeof(Timeline))]
    public class UpdateTimelineDto : EntityDto<Guid>
    {
        [Required]
        public Guid ProjectId { get; set; }
    }
}
