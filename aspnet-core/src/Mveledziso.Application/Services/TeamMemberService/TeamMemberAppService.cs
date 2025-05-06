using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Mveledziso.Authorization;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.TeamMemberService.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mveledziso.Authorization.Users;
using Abp.UI;
using Microsoft.AspNetCore.Authorization;
using Mveledziso.MultiTenancy;
using Abp.Runtime.Session;

namespace Mveledziso.Services.TeamMemberService
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class TeamMemberAppService : AsyncCrudAppService<
        TeamMember,               // The TeamMember entity
        TeamMemberDto,            // DTO for TeamMember
        Guid,                     // Primary key type
        GetTeamMembersInput,     // Used for paging/sorting
        CreateTeamMemberDto,      // Used for creating
        UpdateTeamMemberDto>,     // Used for updating
        ITeamMemberAppService
    {
        private readonly IRepository<UserTeam, Guid> _userTeamRepository;
        private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IAbpSession _abpSession;

        public TeamMemberAppService(
            IRepository<TeamMember, Guid> repository,
            IRepository<UserTeam, Guid> userTeamRepository,
            UserManager userManager,
            TenantManager tenantManager,
            IAbpSession abpSession)
            : base(repository)
        {
            _userTeamRepository = userTeamRepository;
            _userManager = userManager;
            _tenantManager = tenantManager;
            _abpSession = abpSession;
            LocalizationSourceName = MveledzisoConsts.LocalizationSourceName;
        }

        public override async Task<TeamMemberDto> CreateAsync(CreateTeamMemberDto input)
        {
            CheckCreatePermission();

            // Generate username if not provided
            string userName = input.UserName;
            if (string.IsNullOrWhiteSpace(userName))
            {
                userName = input.Email;
            }

            // Check if email is already registered
            if (await _userManager.FindByEmailAsync(input.Email) != null)
            {
                throw new UserFriendlyException(L("EmailAddressAlreadyRegistered"));
            }

            try
            {
                // Create User directly instead of using UserRegistrationManager
                // to avoid tenant restriction
                var user = new User
                {
                    TenantId = _abpSession.TenantId,
                    Name = input.FirstName,
                    Surname = input.LastName,
                    EmailAddress = input.Email,
                    IsActive = true,
                    UserName = userName,
                    IsEmailConfirmed = true
                };

                user.SetNormalizedNames();
                
                // We'll use CurrentUnitOfWork which is already available in AsyncCrudAppService
                await _userManager.InitializeOptionsAsync(_abpSession.TenantId);
                var result = await _userManager.CreateAsync(user, input.Password);
                
                if (!result.Succeeded)
                {
                    throw new UserFriendlyException("User creation failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));
                }

                // Add user to default roles
                var defaultRoles = await _userManager.GetRolesAsync(user);
                await _userManager.SetRolesAsync(user, defaultRoles.ToArray());

                // Create TeamMember entity
                var teamMember = new TeamMember
                {
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    Email = input.Email,
                    Password = input.Password,
                    UserId = user.Id,
                    Role = input.Role
                };

                await Repository.InsertAsync(teamMember);
                await CurrentUnitOfWork.SaveChangesAsync();

                return MapToEntityDto(teamMember);
            }
            catch (Exception ex)
            {
                string errorDetails = ex.Message;
                
                // Add inner exception details if available
                if (ex.InnerException != null)
                {
                    errorDetails += " Inner exception: " + ex.InnerException.Message;
                    
                    // Drill down to the deepest inner exception
                    var innerEx = ex.InnerException;
                    while (innerEx.InnerException != null)
                    {
                        innerEx = innerEx.InnerException;
                        errorDetails += " -> " + innerEx.Message;
                    }
                }
                
                throw new UserFriendlyException("Error creating team member: " + errorDetails);
            }
        }

        public override async Task<TeamMemberDto> UpdateAsync(UpdateTeamMemberDto input)
        {
            CheckUpdatePermission();

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
    }
} 