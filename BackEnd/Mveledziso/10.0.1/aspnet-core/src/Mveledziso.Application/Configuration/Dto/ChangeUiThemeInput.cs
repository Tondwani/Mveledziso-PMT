using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
