namespace backend.Data.Entities;

public class SubscribeRequest
{
    public Boolean Subscribe { get; set; } = true;
    public Guid EventId { get; set; }
}