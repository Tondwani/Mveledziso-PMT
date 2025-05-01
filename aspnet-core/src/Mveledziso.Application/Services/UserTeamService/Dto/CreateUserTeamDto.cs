using Mveledziso.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserTeam.Dto
{
    public class CreateUserTeamDto
    {
        public long UserId { get; set; }
        public Guid TeamId { get; set; }
        public TeamRole Role { get; set; }
    }
}
