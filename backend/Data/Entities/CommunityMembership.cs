namespace backend.Data.Entities;

public class CommunityMembership
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CommunityId { get; set; }
    public string Role { get; set; } = "Member"; 
    public DateTimeOffset JoinedAt { get; set; } = DateTimeOffset.UtcNow;
}
