namespace backend.Data.Entities;

public class CommunityResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Photo { get; set; }
    public Guid CreatorId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public int MemberCount { get; set; }
    public bool IsJoined { get; set; }
    public string? UserRole { get; set; }
}
