using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.TeamService.Dto
{
    [AutoMapFrom(typeof(Team))]
    public class TeamDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int ProjectCount { get; set; }
    }
}
