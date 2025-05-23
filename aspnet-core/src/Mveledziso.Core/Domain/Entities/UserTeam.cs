﻿using Abp.Domain.Entities.Auditing;
using Mveledziso.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mveledziso.Domain.Entities
{
    [Table("UserTeams")]
    public class UserTeam : CreationAuditedEntity<Guid>
    {
        public Guid TeamMemberId { get; set; }

        public Guid TeamId { get; set; }

        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }

        [ForeignKey("TeamMemberId")]
        public virtual TeamMember TeamMember { get; set; }

        public TeamRole Role { get; set; }

        public UserTeam()
        {
            Id = Guid.NewGuid();
            Role = TeamRole.Member;
        }
    }
}
