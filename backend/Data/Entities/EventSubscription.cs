
namespace backend.Data.Entities;
public class EventSubscription
{
    public Guid Id { get; set; }
    public Guid UserId  { get; set; }
    public Guid EventId { get; set; }
}