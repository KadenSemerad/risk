using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using risk.Database.Models;

namespace risk.SignalR;

public class GameHub : Hub
{
    private readonly ConcurrentDictionary<string, string> ConnectedUsers;

    public GameHub(ConcurrentDictionary<string, string> connectedUsers)
    {
        ConnectedUsers = connectedUsers;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext()?.Request.Query["userId"];

        if (!string.IsNullOrEmpty(userId))
        {
            ConnectedUsers.TryAdd(userId!, Context.ConnectionId);
        }

        await base.OnConnectedAsync();
    }

    public async Task SendTurn(string opponentId, List<List<Territory?>> gameBoard)
    {
        if (ConnectedUsers.TryGetValue(opponentId, out var connectionId))
        {
            await Clients.Clients(connectionId).SendAsync("UpdateGameBoard", gameBoard);
        }
    }

    public async Task SendAttackResult(string opponentId, bool won)
    {
        if (ConnectedUsers.TryGetValue(opponentId, out var connectionId))
        {
            await Clients.Clients(connectionId).SendAsync("AttackResult", won);
        }
    }

    public async Task SendTurnOver(string opponentId)
    {
        if (ConnectedUsers.TryGetValue(opponentId, out var connectionId))
        {
            await Clients.Clients(connectionId).SendAsync("TurnOver");
        }
    }

    public async Task SendGameOver(string opponentId)
    {
        if (ConnectedUsers.TryGetValue(opponentId, out var connectionId))
        {
            await Clients.Clients(connectionId).SendAsync("GameOver");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        foreach (var pair in ConnectedUsers)
        {
            if (pair.Value == Context.ConnectionId)
            {
                ConnectedUsers.TryRemove(pair.Key, out _);
                break;
            }
        }

        await base.OnDisconnectedAsync(exception);
    }
}   
