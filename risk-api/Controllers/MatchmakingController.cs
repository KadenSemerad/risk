using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using risk.Database;
using risk.Database.Models;
using risk.Services;

namespace risk.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MatchmakingController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly IMatchmakingService _matchmakingService;
    private readonly UsersDbContext _usersDbContext;
    private readonly ConcurrentDictionary<string, CancellationTokenSource> _cancellationTokenSources;

    public MatchmakingController(
        UserManager<User> userManager,
        IMatchmakingService matchmakingService,
        UsersDbContext usersDbContext,
        ConcurrentDictionary<string, CancellationTokenSource> cancellationTokenSources)
    {
        _userManager = userManager;
        _matchmakingService = matchmakingService;
        _usersDbContext = usersDbContext;
        _cancellationTokenSources = cancellationTokenSources;
    }

    [HttpPost("JoinQueue")]
    public async Task<IActionResult> JoinQueue([FromBody] string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("Must provide userId");
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest("User could not be found");
        }

        var cancellationTokenSource = await _matchmakingService.JoinMatchmakingQueue(user);

        if (_cancellationTokenSources.ContainsKey(userId))
        {
            _ = _cancellationTokenSources.TryRemove(userId, out _);
        }

        var result = _cancellationTokenSources.TryAdd(userId, cancellationTokenSource);

        return result
            ? Ok("Joined queue")
            : BadRequest("Failed to join queue");
    }

    [HttpPost("StartMatchmaking")]
    public async Task<IActionResult> StartMatchmaking([FromBody] string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("Must provide tokenIdentifier");
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest("User could not be found");
        }

        if (_cancellationTokenSources.TryGetValue(userId, out var cancellationTokenSource))
        {
            var game = await _matchmakingService.FindMatchForUser(user, cancellationTokenSource.Token);

            if (game == null)
            {
                return BadRequest("Failed to find a match");
            }

            return Ok(game);
        }
        else
        {
            return BadRequest("Failed to start matchmaking");
        }
    }

    [HttpPost("LeaveQueue")]
    public async Task<IActionResult> LeaveQueue([FromBody] string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest("Must provide tokenIdentifier");
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BadRequest("User could not be found");
        }

        if (_cancellationTokenSources.TryGetValue(userId, out var cancellationTokenSource))
        {
            cancellationTokenSource.Cancel();

            user.Matchmaking = false;

            await _usersDbContext.SaveChangesAsync();

            return _cancellationTokenSources.TryRemove(userId, out _)
                ? Ok("Matchmaking canceled")
                : BadRequest("Failed to cancel matchmaking");
        }
        else
        {
            return BadRequest("Failed to cancel matchmaking");
        }
    }
}
