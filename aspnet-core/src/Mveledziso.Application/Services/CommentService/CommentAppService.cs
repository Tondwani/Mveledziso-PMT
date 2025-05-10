using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Mveledziso.Authorization.Users;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.CommentService.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mveledziso.Services.CommentService
{
    public class CommentAppService : ApplicationService, ICommentAppService
    {
        private readonly IRepository<Comment, Guid> _commentRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<Person, Guid> _personRepository;
        private readonly IAbpSession _abpSession;

        public CommentAppService(
            IRepository<Comment, Guid> commentRepository,
            IRepository<User, long> userRepository,
            IRepository<Person, Guid> personRepository,
            IAbpSession abpSession)
        {
            _commentRepository = commentRepository;
            _userRepository = userRepository;
            _personRepository = personRepository;
            _abpSession = abpSession;
        }

        public async Task<CommentDto> CreateAsync(CreateCommentDto input)
        {
            var comment = new Comment
            {
                Content = input.Content,
                EntityType = input.EntityType,
                EntityId = input.EntityId,
                UserId = _abpSession.UserId.Value
            };

            await _commentRepository.InsertAsync(comment);
            await CurrentUnitOfWork.SaveChangesAsync();

            return await GetAsync(comment.Id);
        }

        public async Task<CommentDto> UpdateAsync(Guid id, UpdateCommentDto input)
        {
            var comment = await _commentRepository.GetAsync(id);
            if (comment.UserId != _abpSession.UserId)
            {
                throw new UserFriendlyException("You can only edit your own comments!");
            }

            comment.Content = input.Content;
            await _commentRepository.UpdateAsync(comment);

            return await GetAsync(id);
        }

        public async Task DeleteAsync(Guid id)
        {
            var comment = await _commentRepository.GetAsync(id);
            if (comment.UserId != _abpSession.UserId)
            {
                throw new UserFriendlyException("You can only delete your own comments!");
            }

            await _commentRepository.DeleteAsync(id);
        }

        public async Task<CommentDto> GetAsync(Guid id)
        {
            var comment = await _commentRepository.GetAsync(id);
            var user = await _userRepository.GetAsync(comment.UserId);
            var person = await _personRepository.GetAll()
                .FirstOrDefaultAsync(p => p.UserId == comment.UserId);

            return new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                UserId = comment.UserId,
                UserName = user.UserName,
                UserType = person is ProjectManager ? "ProjectManager" : "TeamMember",
                EntityType = comment.EntityType,
                EntityId = comment.EntityId,
                CreationTime = comment.CreationTime
            };
        }

        public async Task<List<CommentDto>> GetListAsync(CommentListInputDto input)
        {
            Logger.Debug($"Searching for comments with EntityType: {input.EntityType}, EntityId: {input.EntityId}");
            
            var query = _commentRepository.GetAll()
                .Where(c => c.EntityType == input.EntityType && c.EntityId == input.EntityId);
            
            var count = await query.CountAsync();
            Logger.Debug($"Found {count} comments before pagination");
            
            query = query.OrderByDescending(c => c.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var comments = await query.ToListAsync();
            var userIds = comments.Select(c => c.UserId).Distinct().ToList();
            
            var users = _userRepository.GetAll()
                .Where(u => userIds.Contains(u.Id))
                .ToList();

            var persons = _personRepository.GetAll()
                .Where(p => userIds.Contains(p.UserId))
                .ToList();

            return comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                UserId = c.UserId,
                UserName = users.FirstOrDefault(u => u.Id == c.UserId)?.UserName,
                UserType = persons.FirstOrDefault(p => p.UserId == c.UserId) is ProjectManager ? "ProjectManager" : "TeamMember",
                EntityType = c.EntityType,
                EntityId = c.EntityId,
                CreationTime = c.CreationTime
            }).ToList();
        }
    }
}
