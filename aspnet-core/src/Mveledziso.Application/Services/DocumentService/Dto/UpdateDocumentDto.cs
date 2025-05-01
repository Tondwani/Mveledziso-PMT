using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.DocumentService.Dto
{
    [AutoMapTo(typeof(Document))]
    public class UpdateDocumentDto : EntityDto<Guid>
    {
        [Required]
        [StringLength(255)]
        public string FileName { get; set; }

        [Required]
        [StringLength(1000)]
        public string FileUrl { get; set; }

        [Required]
        public Guid ProjectDutyId { get; set; }
    }
}
