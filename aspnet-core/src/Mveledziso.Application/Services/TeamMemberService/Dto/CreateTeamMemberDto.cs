using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace Mveledziso.Services.TeamMemberService.Dto
{
    [AutoMapTo(typeof(TeamMember))]
    public class CreateTeamMemberDto
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

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [StringLength(50)]
        public string UserName { get; set; }

        /// <summary>
        /// Team member role - defaults to Member (0) if not provided
        /// </summary>
        [DefaultValue(TeamRole.Member)]
        public TeamRole? Role { get; set; }
    }
} 