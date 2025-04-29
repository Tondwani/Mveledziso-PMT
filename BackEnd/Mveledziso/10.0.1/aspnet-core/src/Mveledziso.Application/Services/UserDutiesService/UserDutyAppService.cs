using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Mveledziso.Domain.Entities;
using Mveledziso.Services.UserDutiesService.Dto;
using System;
using System.Linq;

namespace Mveledziso.Services.UserDutiesService
{
    public class UserDutyAppService : AsyncCrudAppService<UserDuty, UserDutyDto, Guid, GetUserDutyInput, CreateUserDutyDto, UpdateUserDutyDto>, IUserDutyAppService
    {
        private readonly IRepository<UserDuty, Guid> _userDutyRepository;

        public UserDutyAppService(IRepository<UserDuty, Guid> userDutyRepository)
            : base(userDutyRepository)
        {
            _userDutyRepository = userDutyRepository;

        }

        protected override IQueryable<UserDuty> CreateFilteredQuery(GetUserDutyInput input)
        {
            return _userDutyRepository.GetAll()
                .WhereIf(input.UserId.HasValue, x => x.UserId == input.UserId.Value)
                .WhereIf(input.ProjectDutyId.HasValue, x => x.ProjectDutyId == input.ProjectDutyId.Value)
                .WhereIf(input.FromDate.HasValue, x => x.CreationTime >= input.FromDate.Value)
                .WhereIf(input.ToDate.HasValue, x => x.CreationTime <= input.ToDate.Value.AddDays(1).AddTicks(-1));
        }

        protected override IQueryable<UserDuty> ApplySorting(IQueryable<UserDuty> query, GetUserDutyInput input)
        {
            return query.OrderByDescending(x => x.CreationTime);
        }
    }
}
