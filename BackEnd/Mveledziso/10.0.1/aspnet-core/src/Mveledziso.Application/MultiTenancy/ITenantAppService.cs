using Abp.Application.Services;
using Mveledziso.MultiTenancy.Dto;

namespace Mveledziso.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

