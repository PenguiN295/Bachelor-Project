namespace backend.Data.Entities;

public class EventRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset EndAt { get; set; }
    public string? Slug { get; set; } = null!;
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public int Price { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string City { get; set; } = null!;
    public string County { get; set; } = null!;
    public IFormFile? ImageFile { get; set; }
    public Guid CreatorId { get; set; }
}
