namespace backend.Data.Entities;

public class EventRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }

    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public int Price { get; set; }
    public string Location { get; set; } = null!;
    public IFormFile? ImageFile { get; set; }
    public Guid CreatorId { get; set; }
}
