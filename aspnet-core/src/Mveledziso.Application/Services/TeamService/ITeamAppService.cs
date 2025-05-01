using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Mveledziso.Services.TeamService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Mveledziso.Services.TeamService
{
    public interface ITeamAppService : IAsyncCrudAppService<
        TeamDto,          
        Guid,             
        GetTeamsInput,   
        CreateTeamDto,    
        UpdateTeamDto     
    >
    {
    }
}
