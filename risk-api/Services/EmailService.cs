using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Identity;
using MimeKit;
using risk.Database.Models;

namespace risk.Services;

public class EmailService
{
    private readonly UserManager<User> _userManager;
    
    public EmailService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    private static string BuildUrl(string controller, string endpoint, string userId, string token)
    {
        const string baseUrl = "https://raikes-risk.azurewebsites.net";

        return baseUrl + $"/api/{controller}/{endpoint}?userId={userId}&token={Uri.EscapeDataString(token)}";
    }
    
    public async Task SendConfirmationEmail(User user)
    {
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var url = BuildUrl("Account", "ConfirmEmail", user.Id, token);
        const string subject = "Risk Email Verification";
        
        Console.WriteLine(token);
        
        // create message body
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $"""<p>Please confirm your email by clicking on the link: <a href="{url}">{url}</a></p>""",
        };

        var body = bodyBuilder.ToMessageBody();

        await SendEmail(user, subject, body);
    }

    public async Task SendPasswordResetRequest(User user)
    {
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var url = BuildUrl("Account", "VerifyPasswordResetRequest", user.Id, token);
        const string subject = "Risk Password Reset Request";

        // create message body
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $"""<p>Follow the link to reset your password: <a href="{url}">{url}</a></p>""",
        };

        var body = bodyBuilder.ToMessageBody();

        await SendEmail(user, subject, body);
    }

    public async Task SendFriendRequest(User sender, User recipient, bool canSeeRealName)
    {
        var url = $"https://raikes-risk.azurewebsites.net/api/Friends/AcceptFriendRequest?requestorId={sender.Id}&userToFriendId={recipient.Id}&canSeeRealName={canSeeRealName}";
        const string subject = "Risk Friend Request";

        // create message body
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $"<p>Follow the link to accept a friend request from {(canSeeRealName ? sender.FirstName : sender.UserName)}: <a href=\"{url}\">{url}</a></p>",
        };
        
        var body = bodyBuilder.ToMessageBody();

        await SendEmail(recipient, subject, body);
    }

    private static async Task SendEmail(User user, string subject, MimeEntity body)
    {
        // create message
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Risk Development Team", "risk-do-not-reply@outlook.com"));
        message.To.Add(new MailboxAddress(user.UserName, user.Email));
        message.Subject = subject;
        message.Body = body;

        using var smtpClient = new SmtpClient();
        
        // connect to smtp
        await smtpClient.ConnectAsync("smtp.office365.com", 587);
        await smtpClient.AuthenticateAsync("risk-do-not-reply@outlook.com", "RiskPassword");

        // send the email then disconnect
        await smtpClient.SendAsync(message);
        await smtpClient.DisconnectAsync(true);
    }
}
