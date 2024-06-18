using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using risk.Database;
using risk.Database.Models;
using risk.Services;
using risk.ViewModels;
namespace risk.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FriendsController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly EmailService _emailService;
    private readonly UsersDbContext _usersDbContext;

    public FriendsController(UserManager<User> userManager, EmailService emailService, UsersDbContext usersDbContext)
    {
        _userManager = userManager;
        _emailService = emailService;
        _usersDbContext = usersDbContext;
    }

    [HttpPost("AddFriend")]
    public async Task<IActionResult> AddFriend([FromBody] AddFriendViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var requestor = await _userManager.FindByIdAsync(model.RequestorId);

        if (requestor == null)
        {
            return BadRequest("User could not be found");
        }

        var userToFriend = await _userManager.FindByNameAsync(model.FriendInfo);

        userToFriend ??= await _userManager.FindByEmailAsync(model.FriendInfo);

        if (userToFriend == null)
        {
            return BadRequest("User could not be found");
        }

        var friend = new Friend
        {
            Id = Guid.NewGuid(),
            UserId = userToFriend.Id,
            User = userToFriend,
            CanSeeRealName = model.CanSeeRealName,
            Accepted = false,
        };

        requestor.Friends.Add(friend);

        await _usersDbContext.SaveChangesAsync();

        await _emailService.SendFriendRequest(requestor, userToFriend, model.CanSeeRealName);

        return Ok("Friend request sent");
    }

    [HttpGet("AcceptFriendRequest")]
    public async Task<IActionResult> AcceptFriendRequest([FromQuery] AcceptFriendRequestViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var requestor = await _userManager.FindByIdAsync(model.RequestorId);

        var userToFriend = await _userManager.FindByIdAsync(model.UserToFriendId);

        if (requestor == null || userToFriend == null)
        {
            return BadRequest("User(s) not found");
        }

        var friendship = requestor.Friends
            .Where(f => f.UserId == model.UserToFriendId)
            .FirstOrDefault();

        if (friendship == null)
        {
            return BadRequest("Friend request not sent");
        }

        friendship.Accepted = true;

        userToFriend.Friends.Add(new Friend{
            Id = Guid.NewGuid(),
            UserId = requestor.Id,
            User = requestor,
            CanSeeRealName = model.CanSeeRealName,
            Accepted = true,
        });

        return await _usersDbContext.SaveChangesAsync() > 0 ? Ok("Friend request accepted") : BadRequest("Failed to accept friend request");
    }
}
