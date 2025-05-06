using System;
using System.Collections.Generic;
using Mveledziso.Domain.Enums;

namespace Mveledziso.Domain.Entities
{
    public class TeamMember : Person
    {
        public TeamMember()
        {
            Teams = new HashSet<UserTeam>();
            AssignedDuties = new HashSet<UserDuty>();
            PersonType = "TeamMember";
            Role = TeamRole.Member; // Default role
        }

        // Role of the team member
        public virtual TeamRole Role { get; set; }

        // Navigation properties
        public virtual ICollection<UserTeam> Teams { get; set; }
        public virtual ICollection<UserDuty> AssignedDuties { get; set; }
    }
} 