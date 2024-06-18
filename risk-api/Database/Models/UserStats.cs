using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace risk.Database.Models;

public class UserStats
{
    [Key]
    public Guid Id { get; set; }
    
    public string UserId = string.Empty;

    [ForeignKey("UserId")]
    public User User { get; set; } = new();

    public int Wins { get; set; } = 0;

    public int Losses { get; set; } = 0;

    public int BattlesWon { get; set; } = 0;
}
