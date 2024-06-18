using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using risk.Database;
using risk.Database.Models;
using risk.Services;

namespace risk.Controllers;

[Route("/api/[controller]")]
[ApiController]
public class GameBoardController : ControllerBase
{
    private readonly UsersDbContext _usersDbContext;
    private readonly IGameBoardService _gameBoardService;

    public GameBoardController(UsersDbContext usersDbContext, IGameBoardService gameBoardService)
    {
        _usersDbContext = usersDbContext;
        _gameBoardService = gameBoardService;
    }

    [HttpPost("StartingGameBoard")]
    public async Task<IActionResult> StartingGameBoard([FromBody] string gameId)
    {
        var game = await _usersDbContext.Games
            .Where(g => g.Id == Guid.Parse(gameId))
            .FirstOrDefaultAsync();

        if (game == null)
        {
            return BadRequest("Game not found");
        }

        var gameBoard = _gameBoardService.GenerateStartingGameBoard(game);

        var gameBoardArray = gameBoard.Select(row => row.Select(territory => territory).ToArray()).ToArray();

        var jsonGameBoard = JsonSerializer.Serialize(gameBoardArray);

        return Ok(jsonGameBoard);
    }
}
