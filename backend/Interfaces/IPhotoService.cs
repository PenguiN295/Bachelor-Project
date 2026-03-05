namespace backend.Interfaces;
using CloudinaryDotNet.Actions;
public interface IPhotoService
{
    public  Task<ImageUploadResult> AddPhotoAsync(IFormFile Photo);
    public Task  DeletePhotoAsync(string publicId);
    public string BuildUrl(string publicId);
    
}