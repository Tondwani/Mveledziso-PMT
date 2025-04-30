using Abp.AutoMapper;
using Microsoft.Build.Framework;
using Mveledziso.Domain.Entities;
using System;

namespace Mveledziso.Services.UserDutiesService.Dto
{
    [AutoMapTo(typeof(UserDuty))]
    public class CreateUserDutyDto
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public Guid ProjectDutyId { get; set; }
    }
}
