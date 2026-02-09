
namespace backend.Services;
using backend.Interfaces;
using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;

public class PasswordHasherService : IPasswordHasher
{

    private const int SaltSize = 16;

    private const int HashSize = 32;
    
      private const int Iterations = 4;
    private const int MemorySize = 65536; 
    private const int Parallelism = 4;

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] hash = HashPasswordWithArgon2(password, salt);


        byte[] combinedBytes = new byte[SaltSize + HashSize];
        Buffer.BlockCopy(salt, 0, combinedBytes, 0, SaltSize);
        Buffer.BlockCopy(hash, 0, combinedBytes, SaltSize, HashSize);
        return Convert.ToBase64String(combinedBytes);
    }

    public bool VerifyPassword(string password, string storedHash)
    {
        try 
        {
            byte[] combinedBytes = Convert.FromBase64String(storedHash);
            byte[] salt = new byte[SaltSize];
            Buffer.BlockCopy(combinedBytes, 0, salt, 0, SaltSize);
            byte[] storedHashBytes = new byte[HashSize];
            Buffer.BlockCopy(combinedBytes, SaltSize, storedHashBytes, 0, HashSize);
            byte[] computedHash = HashPasswordWithArgon2(password, salt);
            return CryptographicOperations.FixedTimeEquals(storedHashBytes, computedHash);
        }
        catch
        {
            return false;
        }
    }

    private static byte[] HashPasswordWithArgon2(string password, byte[] salt)
    {
        using (var argon2 = new Argon2id(Encoding.UTF8.GetBytes(password)))
        {
            argon2.Salt = salt;
            argon2.DegreeOfParallelism = Parallelism;
            argon2.MemorySize = MemorySize;
            argon2.Iterations = Iterations;

            return argon2.GetBytes(HashSize);
        }
    }
}