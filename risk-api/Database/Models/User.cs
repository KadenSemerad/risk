using Microsoft.AspNetCore.Identity;

namespace risk.Database.Models;

public enum Rank
{
    Bronze,
    Silver,
    Gold,
    Platinum,
    Diamond,
    Champion,
}

public class User : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public List<Friend> Friends = new();

    public int RankPoints { get; set; } = 0;

    public Rank Rank { get; set; } = Rank.Bronze;

    public bool Matchmaking { get; set; } = false;
}
