namespace backend.Data.Entities;

public class EventResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset EndAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public decimal Price { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string City { get; set; } = null!;
    public string County { get; set; } = null!;

    public string? ImageUrl { get; set; }
    public Guid CreatorId { get; set; }
    public ICollection<Category> Categories { get; set; } = new HashSet<Category>();
}
