using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Services.TeamMemberService.Dto
{
    [AutoMapTo(typeof(TeamMember))]
    public class UpdateTeamMemberDto : EntityDto<Guid>
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public virtual string Password { get; set; }

        [Required]
        public TeamRole Role { get; set; }
    }
} 