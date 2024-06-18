using System.ComponentModel.DataAnnotations;

namespace risk.Database.Models;
public class Game
{
    [Key]
    public Guid Id { get; set; }

    public string Player1Id { get; set; } = string.Empty;

    public string Player2Id { get; set; } = string.Empty;
}