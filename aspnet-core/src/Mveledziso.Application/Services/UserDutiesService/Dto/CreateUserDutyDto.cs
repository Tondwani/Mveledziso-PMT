using Abp.AutoMapper;
using System.ComponentModel.DataAnnotations;
using Mveledziso.Domain.Entities;
using System;

namespace Mveledziso.Services.UserDutiesService.Dto
{
    [AutoMapTo(typeof(UserDuty))]
    public class CreateUserDutyDto
    {
        [Required]
        public Guid TeamMemberId { get; set; }

        [Required]
        public Guid ProjectDutyId { get; set; }
    }
}
