namespace backend.Data.Entities;

public class Friendship
{
    public Guid Id { get; set; }
    public Guid RequesterId { get; set; }
    public Guid ReceiverId { get; set; }
    
    // Status can be: "Pending", "Accepted", "Blocked"
    public string Status { get; set; } = "Pending"; 
    
    public DateTimeOffset CreatedAt { get; set; }
}