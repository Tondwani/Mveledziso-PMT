using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.ProjectService.Dto
{
    public class GetProjectsInput : PagedResultRequestDto
    {
        public string Filter { get; set; }
        public Guid? TeamId { get; set; }
    }
}
