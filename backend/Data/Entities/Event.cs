namespace backend.Data.Entities;
public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset EndAt { get; set; }
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public int Price { get; set; }
    public string Location { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public Guid CreatorId { get; set; }

}
