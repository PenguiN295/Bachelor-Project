namespace backend.Data.Entities;

public class UserResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? Photo { get; set; }
    public string? Role { get; set; }
}
