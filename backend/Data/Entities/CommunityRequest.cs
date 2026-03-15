namespace backend.Data.Entities;

public class CommunityRequest
{
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public IFormFile? ImageFile { get; set; }
}
