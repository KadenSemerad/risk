using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using risk.Database;

namespace risk.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StatsController : ControllerBase
{
    private static readonly int TOP_NUM_PLAYERS = 5;
    private readonly UsersDbContext _usersDbContext;

    public StatsController(
        UsersDbContext usersDbContext)
    {
        _usersDbContext = usersDbContext;
    }

    [HttpPost("GetLeaderBoard")]
    public async Task<IActionResult> GetStats()
    {
        var topStats = await _usersDbContext.UserStats
            .OrderByDescending(us => us.Wins)
            .Take(TOP_NUM_PLAYERS)
            .ToListAsync();

        var userIds = topStats.Select(us => us.UserId).ToList();

        var users = await _usersDbContext.Users
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync();

        var leaderBoard = new Dictionary<string, int>();

        for (var i = 0; i < topStats.Count; i++)
        {
            leaderBoard.Add(users[i].UserName!, topStats[i].Wins);
        }

        return Ok(leaderBoard);
    }
}