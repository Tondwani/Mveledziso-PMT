using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.DocumentService.Dto
{
    [AutoMapFrom(typeof(Document))]
    public class DocumentDto : EntityDto<Guid>
    {
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public Guid ProjectDutyId { get; set; }
        public DateTime CreationTime { get; set; }
        public long? CreatorUserId { get; set; }
    }
}
