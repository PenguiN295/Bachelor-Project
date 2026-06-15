namespace backend.Data.Entities;

public class EventFeedback
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsAnonymous { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}