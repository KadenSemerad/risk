using System.Collections.Concurrent;
using risk.Database.Models;

namespace risk.Services
{
    public class GameBoardService : IGameBoardService
    {
        private static readonly double TERRITORY_PROBABILITY = 0.25;
        private static readonly int TERRITORY_SPLIT = 16;
        private static readonly int STARTING_TROOP_COUNT = 10;

        // null denotes ocean territory
        private static readonly List<List<Continent?>> WorldMap = new()
        {
            new() {null, null, null, null, null, null, null, null, null, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, null, null, null, null, null, null, null, null, Continent.Asia, Continent.Asia, null, null, null, null, null, null, null, null, null},
            new() {null, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, null, Continent.NorthAmerica, Continent.NorthAmerica, null, null, null, null, Continent.Europe, null, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, null, null, null},
            new() {Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica,  Continent.NorthAmerica, null, Continent.NorthAmerica, null, null, null, null, null, null, Continent.Europe, Continent.Europe, Continent.Europe, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, null, Continent.Asia, null, null, null},
            new() {null, null, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, null, null, null, null, null, null, Continent.Europe, Continent.Europe, Continent.Europe, Continent.Europe, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, null, null, null, null},
            new() {null, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, null, null, null, null, null, null,Continent.Europe, Continent.Europe, null, Continent.Europe, null, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, null, null, null, null, null},
            new() {null, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, Continent.NorthAmerica, null, null, null, null, null, null, null, null, Continent.Europe, Continent.Europe, null, null, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, null, Continent.Asia, null, null, null},
            new() {null, null, Continent.NorthAmerica, null, null, null, null, null, null, null, null, null, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Asia, Continent.Asia, null, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, Continent.Asia, null, null, null, null, null},
            new() {null, null, Continent.NorthAmerica, Continent.NorthAmerica, null, null, null, null, null, null, null, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, null, Continent.Asia, null, null, Continent.Asia, null, Continent.Asia, Continent.Asia, null, null, null, null, null, null},
            new() {null, null, null, null, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, null, null, null, null, null, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, null, null, Continent.Asia, null, null, null, null, null, null, null, null, null},
            new() {null, null, null, null, null, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, null, null, null, null, null, null, Continent.Africa, Continent.Africa, Continent.Africa, Continent.Africa, null, null, null, null, null, Continent.Asia, null, Continent.Asia, null, null, null, null, null},
            new() {null, null, null, null, null, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, null, null, null, null, null, null, Continent.Africa, Continent.Africa, Continent.Africa, null, null, null, null, null, null, null, null, null, null, Continent.Asia, null, null},
            new() {null, null, null, null, null, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, null, null, null, null, null, null, Continent.Africa, Continent.Africa, null, null, null, null, null, null, null, null, null, null, null, null, null, null},
            new() {null, null, null, null, null, null, Continent.SouthAmerica, Continent.SouthAmerica, Continent.SouthAmerica, null, null, null, null, null, null, Continent.Africa, Continent.Africa, null, Continent.Africa, null, null, null, null, null, null, null, Continent.Australia, Continent.Australia, Continent.Australia, null, null},
            new() {null, null, null, null, null, null, Continent.SouthAmerica, Continent.SouthAmerica, null, null, null, null, null, null, null, Continent.Africa, null, null, null, null, null, null, null, null, null, Continent.Australia, Continent.Australia, Continent.Australia, Continent.Australia, null, null},
            new() {null, null, null, null, null, null, Continent.SouthAmerica, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, Continent.Australia, null},
            new() {null, null, null, null, null, null, Continent.SouthAmerica, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, Continent.Australia}
        };

        private readonly ConcurrentDictionary<Guid, List<List<Territory?>>> _activeGameBoards;

        public GameBoardService(ConcurrentDictionary<Guid, List<List<Territory?>>> activeGameBoards)
        {
            _activeGameBoards = activeGameBoards;
        }

        private static List<List<Territory?>> CreateTerritories(Game game)
        {
            var territories = new List<List<Territory?>>();

            var idIndex = 0;

            var random = new Random();

            for (var row = 0; row < WorldMap.Count; row++)
            {
                territories.Add(new List<Territory?>());

                for (var col = 0; col < WorldMap[row].Count; col++)
                {
                    // territory is not in the ocean
                    if (WorldMap[row][col] != null)
                    {
                        // determine who the territory should belong to
                        var playerId = col <= TERRITORY_SPLIT ? game.Player1Id : game.Player2Id;

                        // randomly select starting territories
                        if (random.NextDouble() < TERRITORY_PROBABILITY)
                        {
                            territories[row].Add(new Territory
                            {
                                Id = idIndex,
                                Continent = (Continent)WorldMap[row][col]!,
                                X = col,
                                Y = row,
                                TroopCount = STARTING_TROOP_COUNT,
                                PlayerId = playerId,
                                AdjacentTerritoryIds = new List<int>(),
                            });
                        }

                        // if not selected but not in the ocean, no one owns the territory
                        else
                        {
                            territories[row].Add(new Territory
                            {
                                Id = idIndex,
                                Continent =(Continent)WorldMap[row][col]!,
                                X = col,
                                Y = row,
                                TroopCount = 0,
                                PlayerId = null,
                                AdjacentTerritoryIds = new List<int>(),
                            });
                        }

                        idIndex++;
                    }

                    else
                    {
                        territories[row].Add(null);
                    }
                }
            }

            return territories;
        }

        public List<List<Territory?>> GenerateStartingGameBoard(Game game)
        {
            var territories = CreateTerritories(game);

            for (int row = 0; row < territories.Count; row++)
            {
                for (int col = 0; col < territories[row].Count; col++)
                {
                    if (territories[row][col] != null)
                    {
                        // Create diagonal adjacent territories
                        territories = AddTopLeftAdjacent(territories, row, col);
                        territories = AddBottomLeftAdjacent(territories, row, col);
                        territories = AddTopRightAdjacent(territories, row, col);
                        territories = AddBottomRightAdjacent(territories, row, col);

                        // Determine left adjacent territory
                        var index = col - 1;
                        while (index > -1)
                        {
                            if (territories[row][index] != null)
                            {
                                territories[row][col]!.AdjacentTerritoryIds.Add(territories[row][index]!.Id);
                                break;
                            }
                            index--;
                        }

                        // Determine bottom adjacent territory
                        index = row + 1;
                        while (index < territories.Count)
                        {
                            if (territories[index][col] != null)
                            {
                                territories[row][col]!.AdjacentTerritoryIds.Add(territories[index][col]!.Id);
                                break;
                            }
                            index++;
                        }

                        // Determine right adjacent territory
                        index = col + 1;
                        while (index < territories[row].Count)
                        {
                            if (territories[row][index] != null)
                            {
                                territories[row][col]!.AdjacentTerritoryIds.Add(territories[row][index]!.Id);
                                break;
                            }
                            index++;
                        }

                        // Determine top adjacent territory
                        index = row - 1;
                        while (index > -1)
                        {
                            if (territories[index][col] != null)
                            {
                                territories[row][col]!.AdjacentTerritoryIds.Add(territories[index][col]!.Id);
                                break;
                            }
                            index--;
                        }
                    }
                }
            }

            if (_activeGameBoards.TryAdd(game.Id, territories))
            {
                return territories;
            }

            if (_activeGameBoards.TryGetValue(game.Id, out var existingGameBoard))
            {
                return existingGameBoard;
            }

            return new List<List<Territory?>>();
        }

        private static List<List<Territory?>> AddTopLeftAdjacent(List<List<Territory?>> territories, int row, int col)
        {
            if (row - 1 >= 0 && col - 1 >= 0 && territories[row - 1][col - 1] != null)
            {
                territories[row][col]!.AdjacentTerritoryIds.Add(territories[row - 1][col - 1]!.Id);
            }

            return territories;
        } 

        private static List<List<Territory?>> AddBottomLeftAdjacent(List<List<Territory?>> territories, int row, int col)
        {
            if (row + 1 < territories.Count && col - 1 >= 0 && territories[row + 1][col - 1] != null)
            {
                territories[row][col]!.AdjacentTerritoryIds.Add(territories[row + 1][col - 1]!.Id);
            }

            return territories;
        } 

        private static List<List<Territory?>> AddTopRightAdjacent(List<List<Territory?>> territories, int row, int col)
        {
            if (row - 1 >= 0 && col + 1 < territories[row].Count && territories[row - 1][col + 1] != null)
            {
                territories[row][col]!.AdjacentTerritoryIds.Add(territories[row - 1][col + 1]!.Id);
            }

            return territories;
        }

        private static List<List<Territory?>> AddBottomRightAdjacent(List<List<Territory?>> territories, int row, int col)
        {
            if (row + 1 < territories.Count && col + 1 < territories[row].Count && territories[row + 1][col + 1] != null)
            {
                territories[row][col]!.AdjacentTerritoryIds.Add(territories[row + 1][col + 1]!.Id);
            }

            return territories;
        }
    }
}
