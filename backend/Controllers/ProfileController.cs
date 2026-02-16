namespace backend.Controllers;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data.Entities;
using backend.Data;
using System.Security.Claims;

[ApiController]
public class ProfileController : ControllerBase
{
    public AppDbContext _dbContext;
    public IPasswordHasher _passwordHasher;
    public ProfileController(AppDbContext dbContext, IPasswordHasher passwordHasher)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
    }
    [HttpPut("update-profile")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine("User ID from token: " + userIdClaim);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var user = await _dbContext.Users.FindAsync(userGuid);
        if (user == null)
        {
            return NotFound("User not found");
        }
        if (!string.IsNullOrEmpty(request.Username))
        {
            var newUsername = request.Username;
            if (user.Username == newUsername)
            {
                return BadRequest("New Username cannot be the same as the old username");
            }
            user.Username = request.Username;
        }
        if (!string.IsNullOrEmpty(request.Password))
        {
            var newPasswordHash = _passwordHasher.HashPassword(request.Password);
            if (user.PasswordHash == newPasswordHash)
            {
               return BadRequest("New Password cannot be the same as the old password"); 
            }
            user.PasswordHash = newPasswordHash;
        }
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
        return Ok("Profile updated successfully");
    }
}