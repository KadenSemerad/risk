using Microsoft.EntityFrameworkCore;
using risk.Database;
using risk.Database.Models;

namespace risk.Services;

public class MatchmakingService : IMatchmakingService
{
    private const int STARTING_THRESHOLD = 20;
    private const int MAX_THRESHOLD = 200;
    private const int MATCHMAKING_DELAY = 10000;
    private readonly UsersDbContext _usersDbContext;

    public MatchmakingService(UsersDbContext usersDbContext)
    {
        _usersDbContext = usersDbContext;
    }

    public async Task<CancellationTokenSource> JoinMatchmakingQueue(User user)
    {
        var cancellationTokenSource = new CancellationTokenSource();
        var cancellationToken = cancellationTokenSource.Token;  

        user.Matchmaking = true;

        await _usersDbContext.SaveChangesAsync(cancellationToken);

        return cancellationTokenSource;
    }

    public async Task<Game?> FindMatchForUser(User user, CancellationToken cancellationToken)
    {
        var threshold = STARTING_THRESHOLD;

        try
        {
            // matchmake until a match is found or the user cancels the queue
            while (!cancellationToken.IsCancellationRequested)
            {
                // check if another user has already found the user as an opponent
                var existingGame = await _usersDbContext.Games
                    .Where(g => g.Player1Id == user.Id || g.Player2Id == user.Id)
                    .FirstOrDefaultAsync(cancellationToken);
                
                if (existingGame != null)
                {
                    user.Matchmaking = false;
                    await _usersDbContext.SaveChangesAsync(cancellationToken);
                    return existingGame;
                }

                // query for another user within the current rank threshold and not already in a game
                var opponent = await _usersDbContext.Users
                    .Where(u => u.Id != user.Id && u.Matchmaking && Math.Abs(u.RankPoints - user.RankPoints) <= threshold)
                    .Where(u => !_usersDbContext.Games.Any(g => g.Player1Id == u.Id || g.Player2Id == u.Id))
                    .FirstOrDefaultAsync(cancellationToken);

                // check if an opponent has been found
                if (opponent != null)
                {
                    user.Matchmaking = false;
                    await _usersDbContext.SaveChangesAsync(cancellationToken);
                    // create the game
                    return await CreateGame(user, opponent);
                }

                // increase the threshold until it hits the max threshold
                threshold = Math.Min(threshold * 2, MAX_THRESHOLD);

                // delay task before increasing the threshold
                await Task.Delay(MATCHMAKING_DELAY, cancellationToken);
            }
        }

        catch (OperationCanceledException)
        {
            return null;
        }

        return null;
    }

    private async Task<Game> CreateGame(User user, User opponent)
    {
        var game = new Game
        {
            Id = Guid.NewGuid(),
            Player1Id = user.Id,
            Player2Id = opponent.Id
        };

        _usersDbContext.Games.Add(game);

        await _usersDbContext.SaveChangesAsync();

        return game;
    }
}
