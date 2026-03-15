using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data.Entities;

public class Community
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Photo { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<CommunityMembership> Members { get; set; } = new HashSet<CommunityMembership>();
    public ICollection<Event> Events { get; set; } = new HashSet<Event>();
}
