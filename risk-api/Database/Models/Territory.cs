namespace risk.Database.Models;

public enum Continent {
    NorthAmerica,
    SouthAmerica,
    Europe,
    Africa,
    Asia,
    Australia
}

public class Territory
{
    public int Id { get; set; }

    public Continent Continent { get; set;}

    public int X { get; set;}

    public int Y { get; set; }

    public int TroopCount { get; set; }

    public string? PlayerId { get; set; } = string.Empty;

    public List<int> AdjacentTerritoryIds { get; set; } = new();
}
