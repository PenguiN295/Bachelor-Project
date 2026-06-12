namespace backend.Data.Entities;

public class NotificationResponse
{
    public Guid Id { get; set; }
    public Guid? ActorId { get; set; }
    public string Type { get; set; } = null!;
    public string? ReferenceId { get; set; }
    public string Message { get; set; } = null!;
    public bool IsRead { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}