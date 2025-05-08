using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Mveledziso.Authorization.Roles;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.ProjectManagerService.Dto;
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

namespace Mveledziso.Services.ProjectManagerService
{
    public class ProjectManagerAppService : 
        AsyncCrudAppService<ProjectManager, ProjectManagerDto, Guid, GetProjectManagersInput, CreateProjectManagerDto, UpdateProjectManagerDto>,
        IProjectManagerAppService
    {
        private readonly IRepository<Project, Guid> _projectRepository;
        private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IAbpSession _abpSession;
        private readonly RoleAppService _roleAppService;

        public ProjectManagerAppService(
            IRepository<ProjectManager, Guid> repository,
            IRepository<Project, Guid> projectRepository,
            UserManager userManager,
            TenantManager tenantManager,
            IAbpSession abpSession,
            RoleAppService roleAppService)
            : base(repository)
        {
            _projectRepository = projectRepository;
            _userManager = userManager;
            _tenantManager = tenantManager;
            _abpSession = abpSession;
            _roleAppService = roleAppService;
                
            LocalizationSourceName = MveledzisoConsts.LocalizationSourceName;
        }

        public override async Task<ProjectManagerDto> CreateAsync(CreateProjectManagerDto input)
        {
            try 
            {
                // Ensure role exists
                var projectManagerRole = await EnsureRoleExistsAsync(
                    StaticRoleNames.Tenants.ProjectManager,
                    "Project Manager",
                    "Role for managing projects and teams"
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
                await _userManager.AddToRoleAsync(user, projectManagerRole.Name);

                // Create ProjectManager entity
                var projectManager = new ProjectManager
                {
                    FirstName = input.FirstName,
                    LastName = input.LastName,
                    Email = input.Email,
                    Password = input.Password,
                    UserId = user.Id
                };

                await Repository.InsertAsync(projectManager);
                await CurrentUnitOfWork.SaveChangesAsync();
                
                return MapToEntityDto(projectManager);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("Error creating project manager: " + GetExceptionDetails(ex));
            }
        }

        protected override IQueryable<ProjectManager> CreateFilteredQuery(GetProjectManagersInput input)
        {
            return Repository.GetAllIncluding(pm => pm.ManagedProjects)
                .WhereIf(!input.Filter.IsNullOrWhiteSpace(), x => 
                    x.FirstName.Contains(input.Filter) ||
                    x.LastName.Contains(input.Filter) ||
                    x.Email.Contains(input.Filter))
                .WhereIf(input.ProjectId.HasValue, x => 
                    x.ManagedProjects.Any(p => p.Id == input.ProjectId.Value));
        }

        public async Task<ProjectManagerDto> GetProjectManagerWithDetailsAsync(EntityDto<Guid> input)
        {
            var projectManager = await Repository.GetAllIncluding(
                    pm => pm.ManagedProjects)
                .FirstOrDefaultAsync(pm => pm.Id == input.Id);

            if (projectManager == null)
            {
                throw new Abp.UI.UserFriendlyException(L("ProjectManagerNotFound"));
            }

            return MapToEntityDto(projectManager);
        }

        protected override async Task<ProjectManager> GetEntityByIdAsync(Guid id)
        {
            var projectManager = await Repository.GetAllIncluding(
                    pm => pm.ManagedProjects)
                .FirstOrDefaultAsync(pm => pm.Id == id);

            if (projectManager == null)
            {
                throw new Abp.UI.UserFriendlyException(L("ProjectManagerNotFound"));
            }

            return projectManager;
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