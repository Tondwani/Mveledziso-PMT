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
            if (string.IsNullOrEmpty(input.Content))
            {
                throw new UserFriendlyException("Comment content cannot be empty");
            }

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
            try
            {
                if (input == null)
                {
                    throw new UserFriendlyException("Input parameters cannot be null");
                }

                if (string.IsNullOrEmpty(input.EntityType))
                {
                    throw new UserFriendlyException("EntityType must be specified");
                }

                if (input.EntityId == Guid.Empty)
                {
                    throw new UserFriendlyException("Valid EntityId must be specified");
                }

                Logger.Debug($"Fetching comments for EntityType: {input.EntityType}, EntityId: {input.EntityId}");

                var query = await _commentRepository.GetAll()
                    .Where(c => c.EntityType == input.EntityType && c.EntityId == input.EntityId)
                    .OrderByDescending(c => c.CreationTime)
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount)
                    .ToListAsync();

                if (!query.Any())
                {
                    Logger.Debug($"No comments found for EntityType: {input.EntityType}, EntityId: {input.EntityId}");
                    return new List<CommentDto>();
                }

                var userIds = query.Select(c => c.UserId).Distinct().ToList();
                
                var users = await _userRepository.GetAll()
                    .Where(u => userIds.Contains(u.Id))
                    .ToListAsync();

                var persons = await _personRepository.GetAll()
                    .Where(p => userIds.Contains(p.UserId))
                    .ToListAsync();

                var result = query.Select(c =>
                {
                    var user = users.FirstOrDefault(u => u.Id == c.UserId);
                    var person = persons.FirstOrDefault(p => p.UserId == c.UserId);

                    return new CommentDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        UserId = c.UserId,
                        UserName = user?.UserName ?? "Unknown User",
                        UserType = person is ProjectManager ? "ProjectManager" : "TeamMember",
                        EntityType = c.EntityType,
                        EntityId = c.EntityId,
                        CreationTime = c.CreationTime
                    };
                }).ToList();

                Logger.Debug($"Successfully retrieved {result.Count} comments");
                return result;
            }
            catch (Exception ex)
            {
                Logger.Error($"Error retrieving comments: {ex.Message}", ex);
                throw new UserFriendlyException("An error occurred while retrieving comments. Please try again.");
            }
        }
    }
}
