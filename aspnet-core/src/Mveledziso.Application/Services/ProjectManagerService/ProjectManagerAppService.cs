using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.Linq.Extensions;
using Mveledziso.Authorization;
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

namespace Mveledziso.Services.ProjectManagerService
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class ProjectManagerAppService : AsyncCrudAppService<
        ProjectManager,             // The ProjectManager entity
        ProjectManagerDto,          // DTO for ProjectManager
        Guid,                      // Primary key type
        GetProjectManagersInput,   // Used for paging/sorting
        CreateProjectManagerDto,   // Used for creating
        UpdateProjectManagerDto>,  // Used for updating
        IProjectManagerAppService
    {
        private readonly IRepository<Project, Guid> _projectRepository;
        private readonly UserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IAbpSession _abpSession;

        public ProjectManagerAppService(
            IRepository<ProjectManager, Guid> repository,
            IRepository<Project, Guid> projectRepository,
            UserManager userManager,
            TenantManager tenantManager,
            IAbpSession abpSession)
            : base(repository)
        {
            _projectRepository = projectRepository;
            _userManager = userManager;
            _tenantManager = tenantManager;
            _abpSession = abpSession;
            LocalizationSourceName = MveledzisoConsts.LocalizationSourceName;
        }

        public override async Task<ProjectManagerDto> CreateAsync(CreateProjectManagerDto input)
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

                // Create ProjectManager entity the proper way
                var projectManager = new ProjectManager();
                projectManager.FirstName = input.FirstName;
                projectManager.LastName = input.LastName;
                projectManager.Email = input.Email;
                projectManager.Password = input.Password;
                projectManager.UserId = user.Id;

                await Repository.InsertAsync(projectManager);
                await CurrentUnitOfWork.SaveChangesAsync();
                
                return MapToEntityDto(projectManager);
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
                
                throw new UserFriendlyException("Error creating project manager: " + errorDetails);
            }
        }

        public override async Task<ProjectManagerDto> UpdateAsync(UpdateProjectManagerDto input)
        {
            CheckUpdatePermission();

            var projectManager = await Repository.GetAsync(input.Id);

            ObjectMapper.Map(input, projectManager);
            await Repository.UpdateAsync(projectManager);

            return await GetAsync(input);
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
    }
} 