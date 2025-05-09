using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Services.UserDutiesService.Dto
{
    [AutoMapTo(typeof(UserDuty))]
    public class UpdateUserDutyDto : EntityDto<Guid>
    {
        [Required]
        public Guid TeamMemberId { get; set; }

        [Required]
        public Guid ProjectDutyId { get; set; }
    }
}
