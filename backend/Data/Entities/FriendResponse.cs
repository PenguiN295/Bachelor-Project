namespace backend.Data.Entities;

public class FriendResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = null!;
    public string? Photo { get; set; }
    public string Status { get; set; } = null!; // "Pending" or "Accepted"
    public bool IsRequester { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}