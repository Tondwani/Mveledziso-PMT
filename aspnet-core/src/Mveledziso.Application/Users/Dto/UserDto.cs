using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Mveledziso.Authorization.Users;
using Mveledziso.Services.UserTeamService.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Users.Dto;

[AutoMapFrom(typeof(User))]
public class UserDto : EntityDto<long>
{
    [Required]
    [StringLength(AbpUserBase.MaxUserNameLength)]
    public string UserName { get; set; }

    [Required]
    [StringLength(AbpUserBase.MaxNameLength)]
    public string Name { get; set; }

    [Required]
    [StringLength(AbpUserBase.MaxSurnameLength)]
    public string Surname { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(AbpUserBase.MaxEmailAddressLength)]
    public string EmailAddress { get; set; }

    public bool IsActive { get; set; }

    public string FullName { get; set; }

    public DateTime? LastLoginTime { get; set; }

    public DateTime CreationTime { get; set; }

    public string[] RoleNames { get; set; }

    public List<UserTeamDto> UserTeams { get; set; } = new List<UserTeamDto>();
}
