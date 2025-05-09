using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Mveledziso.Authorization.Roles;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.TeamMemberService.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mveledziso.Authorization.Users;
using Abp.UI;
using Mveledziso.MultiTenancy;
using Abp.Runtime.Session;
using Mveledziso.Roles;
using Mveledziso.Roles.Dto;
using Mveledziso.Domain.Enums;

namespace Mveledziso.Services.TeamMemberService
{
    public class TeamMemberAppService : 
        AsyncCrudAppService<TeamMember, TeamMemberDto, Guid, GetTeamMembersInput, CreateTeamMemberDto, UpdateTeamMemberDto>,
        ITeamMemberAppService
    {
        private readonly IRepository<UserTeam, Guid> _userTeamRepository;
        private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IAbpSession _abpSession;
        private readonly RoleAppService _roleAppService;

        public TeamMemberAppService(
            IRepository<TeamMember, Guid> repository,
            IRepository<UserTeam, Guid> userTeamRepository,
            UserManager userManager,
            TenantManager tenantManager,
            IAbpSession abpSession,
            RoleAppService roleAppService)
            : base(repository)
        {
            _userTeamRepository = userTeamRepository;
            _userManager = userManager;
            _tenantManager = tenantManager;
            _abpSession = abpSession;
            _roleAppService = roleAppService;
            
            LocalizationSourceName = MveledzisoConsts.LocalizationSourceName;
        }

        public override async Task<TeamMemberDto> CreateAsync(CreateTeamMemberDto input)
        {
            try
            {
                // Ensure role exists
                var teamMemberRole = await EnsureRoleExistsAsync(
                    StaticRoleNames.Tenants.TeamMember,
                    "Team Member",
                    "Role for team members who participate in projects"
                );

                // Create user
                var user = await CreateUserAsync(
                    input.FirstName,
                    input.LastName,
                    input.Email,
                    input.Password,
                    input.UserName
                );

                // Add user to role
                await _userManager.AddToRoleAsync(user, teamMemberRole.Name);

                // Create TeamMember entity
                var teamMember = new TeamMember
                {
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    Email = input.Email,
                    Password = input.Password,
                    UserId = user.Id,
                    Role = input.Role ?? TeamRole.Member // Use provided role or default to Member
                };

                await Repository.InsertAsync(teamMember);
                await CurrentUnitOfWork.SaveChangesAsync();

                return MapToEntityDto(teamMember);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error creating team member: " + GetExceptionDetails(ex));
            }
        }

        public override async Task<TeamMemberDto> UpdateAsync(UpdateTeamMemberDto input)
        {
            var teamMember = await Repository.GetAsync(input.Id);

            ObjectMapper.Map(input, teamMember);
            await Repository.UpdateAsync(teamMember);

            return await GetAsync(input);
        }

        protected override IQueryable<TeamMember> CreateFilteredQuery(GetTeamMembersInput input)
        {
            return Repository.GetAll()
                .WhereIf(!input.Filter.IsNullOrWhiteSpace(), x => 
                    x.FirstName.Contains(input.Filter) ||
                    x.LastName.Contains(input.Filter) ||
                    x.Email.Contains(input.Filter))
                .WhereIf(input.Role.HasValue, x => x.Role == input.Role.Value)
                .WhereIf(input.TeamId.HasValue, x => x.Teams.Any(t => t.TeamId == input.TeamId.Value));
        }

        public async Task<ListResultDto<TeamMemberDto>> GetTeamMembersByTeamAsync(EntityDto<Guid> input)
        {
            var query = from userTeam in _userTeamRepository.GetAll()
                       join teamMember in Repository.GetAll() on userTeam.TeamMemberId equals teamMember.Id
                       where userTeam.TeamId == input.Id
                       select teamMember;

            var teamMembers = await query.ToListAsync();

            return new ListResultDto<TeamMemberDto>(
                ObjectMapper.Map<List<TeamMemberDto>>(teamMembers)
            );
        }

        #region Helper Methods
        
        private async Task<User> CreateUserAsync(string firstName, string lastName, string email, string password, string userName)
        {
            // Generate username if not provided
            if (string.IsNullOrWhiteSpace(userName))
            {
                userName = email;
            }

            // Check if email is already registered
            if (await _userManager.FindByEmailAsync(email) != null)
            {
                throw new UserFriendlyException(L("EmailAddressAlreadyRegistered"));
            }

            // Create User
            var user = new User
            {
                TenantId = _abpSession.TenantId,
                Name = firstName,
                Surname = lastName,
                EmailAddress = email,
                IsActive = true,
                UserName = userName,
                IsEmailConfirmed = true
            };

            user.SetNormalizedNames();
            
            await _userManager.InitializeOptionsAsync(_abpSession.TenantId);
            var result = await _userManager.CreateAsync(user, password);
            
            if (!result.Succeeded)
            {
                throw new UserFriendlyException("User creation failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            return user;
        }

        private async Task<RoleListDto> EnsureRoleExistsAsync(string roleName, string displayName, string description)
        {
            var roles = await _roleAppService.GetRolesAsync(new GetRolesInput());
            var role = roles.Items.FirstOrDefault(r => r.Name == roleName);

            if (role == null)
            {
                // Create the role if it doesn't exist
                var createRoleDto = new CreateRoleDto
                {
                    Name = roleName,
                    DisplayName = displayName,
                    Description = description,
                    GrantedPermissions = new List<string>()
                };

                var createdRole = await _roleAppService.CreateAsync(createRoleDto);
                role = new RoleListDto 
                { 
                    Name = createdRole.Name,
                    DisplayName = createdRole.DisplayName
                };
            }

            return role;
        }

        private string GetExceptionDetails(Exception ex)
        {
            string errorDetails = ex.Message;
            if (ex.InnerException != null)
            {
                errorDetails += " Inner exception: " + ex.InnerException.Message;
                var innerEx = ex.InnerException;
                while (innerEx.InnerException != null)
                {
                    innerEx = innerEx.InnerException;
                    errorDetails += " -> " + innerEx.Message;
                }
            }
            return errorDetails;
        }
        
        #endregion
    }
} 