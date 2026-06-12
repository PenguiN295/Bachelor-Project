namespace backend.Data.Entities;

public class Notification
{
    public Guid Id { get; set; }
    
    // The user who receives the notification
    public Guid UserId { get; set; }
    
    // The user who triggered the notification (optional, e.g. the subscriber)
    public Guid? ActorId { get; set; }
    
    // e.g., "EventSubscription", "ChatMessage", "FriendRequest"
    public string Type { get; set; } = null!;
    
    // Related entity ID (e.g., EventId)
    public string? ReferenceId { get; set; }
    
    public string Message { get; set; } = null!;
    
    public bool IsRead { get; set; } = false;
    
    public DateTimeOffset CreatedAt { get; set; }
}