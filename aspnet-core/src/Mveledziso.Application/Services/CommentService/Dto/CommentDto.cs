using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.CommentService.Dto
{
    [AutoMapFrom(typeof(Comment))]
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; } 
        public string EntityType { get; set; }
        public Guid EntityId { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
