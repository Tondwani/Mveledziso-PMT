using Mveledziso.Services.CommentService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.CommentService
{
    public interface ICommentAppService
    {
        Task<CommentDto> CreateAsync(CreateCommentDto input);
        Task<CommentDto> UpdateAsync(Guid id, UpdateCommentDto input);
        Task DeleteAsync(Guid id);
        Task<CommentDto> GetAsync(Guid id);
        Task<List<CommentDto>> GetListAsync(CommentListInputDto input);
    }
}
