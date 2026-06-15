using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data.Entities;
using backend.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

[ApiController]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IPhotoService _photoService;

    public ProfileController(AppDbContext dbContext, IPasswordHasher passwordHasher, IPhotoService photoService)
    {
        _dbContext = dbContext;
        _passwordHasher = passwordHasher;
        _photoService = photoService;
    }
    [HttpPut("update-profile")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
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

    [HttpGet("user-info")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetUserInfo()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var user = await _dbContext.Users.FindAsync(userGuid);
        if (user == null)
        {
            return NotFound("User not found");
        }
        return Ok(new { user.Username, user.Id, Photo = user.Photo != null ? _photoService.BuildUrl(user.Photo) : null, Role = user.Role });
    }

    [HttpPost("update-photo")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> UpdatePhoto([FromForm] IFormFile photo)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var user = await _dbContext.Users.FindAsync(userGuid);
        if (user == null) return NotFound("User not found");

        if (photo == null || photo.Length == 0) return BadRequest("No photo provided");

        var result = await _photoService.AddPhotoAsync(photo);
        if (result == null) return BadRequest("Failed to upload photo");

        if (!string.IsNullOrEmpty(user.Photo))
        {
            await _photoService.DeletePhotoAsync(user.Photo);
        }

        user.Photo = result.PublicId;
        await _dbContext.SaveChangesAsync();

        return Ok(new { photoUrl = _photoService.BuildUrl(user.Photo) });
    }

    [HttpDelete("delete-account")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var user = await _dbContext.Users.FindAsync(userGuid);
        if (user == null) return NotFound("User not found");

        if (!string.IsNullOrEmpty(user.Photo))
        {
            await _photoService.DeletePhotoAsync(user.Photo);
        }

        // Optional: delete event photos created by user if you want to prevent wasted space
        var userEvents = await _dbContext.Events.Where(e => e.CreatorId == userGuid && e.ImageUrl != null).ToListAsync();
        foreach (var ev in userEvents)
        {
            await _photoService.DeletePhotoAsync(ev.ImageUrl);
        }

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();

        return Ok("Account deleted successfully");
    }

    [HttpGet("user/{userId}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetUserInfoById(Guid userId)
    {
        var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return NotFound("User not found");
        }
        
        var response = new UserResponse
        {
            Id = user.Id,
            Username = user.Username,
            Photo = user.Photo != null ? _photoService.BuildUrl(user.Photo) : null,
            Role = user.Role,
            IsBanned = user.IsBanned
        };
        
        return Ok(response);
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _dbContext.Users
            .AsNoTracking()
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Username = u.Username,
                Photo = u.Photo,
                Role = u.Role,
                IsBanned = u.IsBanned
            })
            .ToListAsync();

        foreach (var u in users)
        {
            if (u.Photo != null)
            {
                u.Photo = _photoService.BuildUrl(u.Photo);
            }
        }

        return Ok(users);
    }

    [HttpPost("user/{userId}/ban")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BanUser(Guid userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound("User not found");
        if (user.Role == "Admin") return BadRequest("Cannot ban an admin");

        user.IsBanned = true;
        await _dbContext.SaveChangesAsync();
        return Ok("User banned successfully");
    }

    [HttpPost("user/{userId}/unban")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UnbanUser(Guid userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null) return NotFound("User not found");

        user.IsBanned = false;
        await _dbContext.SaveChangesAsync();
        return Ok("User unbanned successfully");
    }
}