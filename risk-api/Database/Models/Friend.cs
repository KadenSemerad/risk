using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace risk.Database.Models;

public class Friend
{
    [Key]
    public Guid Id { get; set; } = new Guid();   

    public string UserId { get; set; } = string.Empty;

    [ForeignKey("UserId")]
    public User User { get; set; } = new User();

    public bool CanSeeRealName { get; set; } = false;

    public bool Accepted { get; set; } = false;
}