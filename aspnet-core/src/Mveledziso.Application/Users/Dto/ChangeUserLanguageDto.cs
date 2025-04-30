using System.ComponentModel.DataAnnotations;

namespace Mveledziso.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}