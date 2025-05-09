using Abp.Application.Services.Dto;
using System;

namespace Mveledziso.Services.ProjectManagerService.Dto
{
    public class GetProjectManagersInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
        public Guid? ProjectId { get; set; }
    }
} 