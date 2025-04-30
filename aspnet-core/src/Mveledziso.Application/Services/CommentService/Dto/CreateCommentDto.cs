using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.CommentService.Dto
{
    public class CreateCommentDto
    {
        [Required]
        [StringLength(500)]
        public string Content { get; set; }

        [Required]
        public string EntityType { get; set; }

        [Required]
        public Guid EntityId { get; set; }
    }
}
