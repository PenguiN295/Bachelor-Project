namespace backend.Data.Entities;

public class EventAnalyticsResponse
{
    public int TotalSubscribers { get; set; }
    public int MaxCapacity { get; set; }
    public double AttendanceRate { get; set; }
    public decimal TotalRevenue { get; set; }
}
