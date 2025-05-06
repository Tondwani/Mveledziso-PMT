using Abp.Application.Services.Dto;
using Mveledziso.Domain.Enums;
using System;

namespace Mveledziso.Services.TeamMemberService.Dto
{
    public class GetTeamMembersInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
        public TeamRole? Role { get; set; }
        public Guid? TeamId { get; set; }
    }
} 