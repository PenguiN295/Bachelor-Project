namespace backend.Data.Entities;

public class EventFeedbackResponse
{
    public Guid Id { get; set; }
    public Guid EventId { get; set; }
    public Guid? UserId { get; set; } // Null if anonymous
    public string? Username { get; set; } // "Anonymous Attendee" if anonymous
    public string? Photo { get; set; } // Null if anonymous
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsAnonymous { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}