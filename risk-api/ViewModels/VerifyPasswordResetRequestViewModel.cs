namespace risk.ViewModels;

public class VerifyPasswordResetRequestViewModel
{
    public string UserId { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;
}