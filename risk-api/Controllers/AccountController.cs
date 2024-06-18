using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using risk.Database;
using risk.Database.Models;
using risk.Services;
using risk.ViewModels;

namespace risk.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private const string FRONTEND_URL = "http://localhost:3000";

    private readonly UserManager<User> _userManager;
    private readonly UsersDbContext _usersDbContext;
    private readonly EmailService _emailService;

    public AccountController(UserManager<User> userManager, EmailService emailService, UsersDbContext usersDbContext)
    {
        _userManager = userManager;
        _emailService = emailService;
        _usersDbContext = usersDbContext;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] RegistrationViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new User
        {
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            UserName = model.UserName,
            EmailConfirmed = false,
            Friends = new List<Friend>(),
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        // send email confirmation if successful
        if (result.Succeeded)
        {
            await _emailService.SendConfirmationEmail(user);

            return Ok("Registration successful");
        }

        return BadRequest(result.Errors);
    }

    [HttpGet("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmail([FromQuery] ConfirmEmailViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(model.UserId);

        if (user == null)
        {
            return BadRequest("User not found");
        }

        // attempt to confirm email using the query token
        var result = await _userManager.ConfirmEmailAsync(user, model.Token);

        if(!result.Succeeded)
        {
            return Redirect($"{FRONTEND_URL}/login/failure");
        }

        var userStats = new UserStats
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            User = user,
        };

        _usersDbContext.UserStats.Add(userStats);

        await _usersDbContext.SaveChangesAsync();

        return Redirect($"{FRONTEND_URL}/login/success");
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByNameAsync(model.UserName);

        if (user == null)
        {
            return BadRequest("Account does not exist");
        }

        // if the user has not yet confirmed their email, send another confirmation email
        if (!user.EmailConfirmed)
        {
            await _emailService.SendConfirmationEmail(user);

            return BadRequest("Email not yet confirmed, another verification email has been sent");
        }

        // attempt login
        if (await _userManager.CheckPasswordAsync(user, model.Password))
        {
            return Ok(user);
        }
        
        return BadRequest("Incorrect password");
    }

    [HttpPost("PasswordResetRequest")]
    public async Task<IActionResult> PasswordResetRequest([FromBody] PasswordResetRequestViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
        {
            return BadRequest("User not found");
        }

        if (!user.EmailConfirmed)
        {
            await _emailService.SendConfirmationEmail(user);

            return Unauthorized(new { StatusCode = 401, Message = "Email not yet confirmed, another confirmation email has been sent" });
        }

        await _emailService.SendPasswordResetRequest(user);

        return Ok();
    }

    [HttpGet("VerifyPasswordResetRequest")]
    public async Task<IActionResult> VerifyPasswordResetRequest([FromQuery] VerifyPasswordResetRequestViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(model.UserId);

        if (user == null)
        {
            return BadRequest("User not found");
        }

        // check if token is valid
        var result = await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", model.Token);

        // route to frontend success page or return a bad request
        return result
            ? Redirect($"{FRONTEND_URL}/resetPassword/{Uri.EscapeDataString(model.Token)}/{Uri.EscapeDataString(user.Id)}")
            : BadRequest("Password reset failed");
    }

    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var user = await _userManager.FindByIdAsync(model.UserId);

        if (user == null)
        {
            return BadRequest("User not found");
        }
        
        // attempt to change password
        var result = await _userManager.ResetPasswordAsync(user, Uri.UnescapeDataString(model.Token), model.NewPassword);

        return result.Succeeded
            ? Ok("Password reset successful")
            : BadRequest("Failed to reset password");
    }

    [HttpPost("DeleteAccount")]
    public async Task<IActionResult> DeleteAccount(DeleteAccountViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByIdAsync(model.UserId);

        if (user == null)
        {
            return BadRequest("User not found");
        }

        var loginResult = await _userManager.CheckPasswordAsync(user, model.Password);

        if (!loginResult)
        {
            return BadRequest("Incorrect password");
        }

        var result = await _userManager.DeleteAsync(user);

        return result.Succeeded
            ? Ok("Account deleted")
            : BadRequest("Failed to delete account");
    }
}