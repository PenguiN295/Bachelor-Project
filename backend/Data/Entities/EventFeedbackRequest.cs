namespace backend.Data.Entities;

public class EventFeedbackRequest
{
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsAnonymous { get; set; }
}