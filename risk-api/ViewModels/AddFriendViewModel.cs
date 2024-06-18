namespace risk.ViewModels;

public class AddFriendViewModel
{
    public string RequestorId { get; set; } = string.Empty;

    // could be username or email
    public string FriendInfo { get; set; } = string.Empty;

    public bool CanSeeRealName { get; set; } = false;
}