using Abp.AutoMapper;
using Mveledziso.Domain.Entities;
using System;
using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Services.ProjectManagerService.Dto
{
    [AutoMapTo(typeof(ProjectManager))]
    public class CreateProjectManagerDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(100)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
        
        [StringLength(50)]
        public string UserName { get; set; }
    }
} 