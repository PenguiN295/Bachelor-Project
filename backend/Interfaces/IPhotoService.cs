namespace backend.Interfaces;
using CloudinaryDotNet.Actions;
public interface IPhotoService
{
    public  Task<ImageUploadResult> AddPhotoAsync(IFormFile Photo);
}