using risk.Database.Models;

namespace risk.Services;

public interface IMatchmakingService
{
    public Task<CancellationTokenSource> JoinMatchmakingQueue(User user);
    public Task<Game?> FindMatchForUser(User user, CancellationToken cancellationToken);
}
