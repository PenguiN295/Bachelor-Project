namespace backend.Data.Entities;
public class FilterRequest
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartDate { get; set; } = DateTime.MinValue;
    public int MaxAttendees { get; set; }
    public int CurrentAttendees { get; set; }
    public int Price { get; set; }
    public string Location { get; set; } = null!;

}
