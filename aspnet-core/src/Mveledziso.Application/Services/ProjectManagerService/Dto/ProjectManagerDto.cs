using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.ProjectService.Dto;
using System;
using System.Collections.Generic;

namespace Mveledziso.Services.ProjectManagerService.Dto
{
    [AutoMapFrom(typeof(ProjectManager))]
    public class ProjectManagerDto : EntityDto<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public long UserId { get; set; }
        public List<ProjectDto> ManagedProjects { get; set; }
    }
} 