using risk.Database.Models;

namespace risk.Services;

public interface IGameBoardService
{
    public List<List<Territory?>> GenerateStartingGameBoard(Game game);
}
