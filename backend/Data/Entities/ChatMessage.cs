namespace backend.Data.Entities;

public class ChatMessage
{
    public Guid Id { get; set; }
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    
    public string Content { get; set; } = null!;
    
    public bool IsRead { get; set; } = false;
    
    public DateTimeOffset CreatedAt { get; set; }
}