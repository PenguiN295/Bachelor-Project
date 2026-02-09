using backend.Data.Entities;

namespace backend.Interfaces;

public interface ITokenService
{
   public string GenerateToken(User user);
}