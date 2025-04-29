using Abp.Application.Services;
using Mveledziso.Services.UserDutiesService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mveledziso.Services.UserDutiesService
{
    public interface IUserDutyAppService : IAsyncCrudAppService<UserDutyDto, Guid, GetUserDutyInput, CreateUserDutyDto, UpdateUserDutyDto>
    {
    }
}
