using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Domain.Enums;
using System;

namespace Mveledziso.Services.TeamMemberService.Dto
{
    [AutoMapFrom(typeof(TeamMember))]
    public class TeamMemberDto : EntityDto<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public long UserId { get; set; }
        public TeamRole Role { get; set; }
    }
} 