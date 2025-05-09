using Mveledziso.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Services.UserTeamService.Dto
{
    public class UpdateUserTeamDto
    {
        [Required]
        public TeamRole Role { get; set; }
    }
}
