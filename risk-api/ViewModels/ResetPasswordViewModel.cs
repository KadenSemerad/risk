﻿namespace risk.ViewModels;

public class ResetPasswordViewModel
{
    public string UserId { get; set; } = string.Empty;

    public string Token { get; set; } = string.Empty;

    public string NewPassword { get; set; } = string.Empty;
}