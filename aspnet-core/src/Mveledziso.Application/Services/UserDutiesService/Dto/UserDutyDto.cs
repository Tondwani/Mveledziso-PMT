using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserDutiesService.Dto
{
    [AutoMapFrom(typeof(UserDuty))]
    public class UserDutyDto : EntityDto<Guid>
    {
        public Guid TeamMemberId { get; set; }
        public Guid ProjectDutyId { get; set; }
        public DateTime CreationTime { get; set; }
        public long? CreatorUserId { get; set; }
    }
}
