namespace backend.Data.Entities;
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Photo { get; set; } = null!;
    public string Role { get; set; } = "User"; 
}