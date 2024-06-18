namespace risk.ViewModels;

public class AcceptFriendRequestViewModel
{
    // requestor id
    public string RequestorId { get; set; } = string.Empty;

    // user to friend id
    public string UserToFriendId { get; set; } = string.Empty;

    public bool CanSeeRealName { get; set; } = false;
}