using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.CommentService.Dto
{
    public class CommentListInputDto
    {
        public string EntityType { get; set; }
        public Guid EntityId { get; set; }
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; } = 10;
    }
}
