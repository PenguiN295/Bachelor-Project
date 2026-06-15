namespace backend.Data.Entities;

public class EventAnalyticsResponse
{
    public int TotalSubscribers { get; set; }
    public int MaxCapacity { get; set; }
    public double AttendanceRate { get; set; }
    public decimal TotalRevenue { get; set; }
    public double? AverageRating { get; set; }
    public List<EventFeedbackResponse> Feedbacks { get; set; } = new();
}
