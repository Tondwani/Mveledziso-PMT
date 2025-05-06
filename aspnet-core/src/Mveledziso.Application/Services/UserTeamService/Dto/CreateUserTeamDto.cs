using Mveledziso.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Services.UserTeamService.Dto
{
    public class CreateUserTeamDto
    {
        [Required]
        public Guid TeamMemberId { get; set; }

        [Required]
        public Guid TeamId { get; set; }

        [Required]
        public TeamRole Role { get; set; }
    }
}
