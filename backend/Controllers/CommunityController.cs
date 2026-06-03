using backend.Data;
using backend.Data.Entities;
using backend.Interfaces;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/communities")]
public class CommunityController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IPhotoService _photoService;

    public CommunityController(AppDbContext dbContext, IPhotoService photoService)
    {
        _dbContext = dbContext;
        _photoService = photoService;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateCommunity([FromForm] CommunityRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }

        string? photoId = null;
        if (request.ImageFile != null)
        {
            var result = await _photoService.AddPhotoAsync(request.ImageFile);
            photoId = result.PublicId;
        }

        var communityId = Guid.NewGuid();
        var community = new Community
        {
            Id = communityId,
            Name = request.Name,
            Description = request.Description,
            CreatorId = userGuid,
            CreatedAt = DateTimeOffset.UtcNow,
            Photo = photoId,
            Slug = SlugService.Generate(request.Name, communityId)
        };

        var membership = new CommunityMembership
        {
            Id = Guid.NewGuid(),
            UserId = userGuid,
            CommunityId = communityId,
            Role = "Owner",
            JoinedAt = DateTimeOffset.UtcNow
        };

        await _dbContext.Communities.AddAsync(community);
        await _dbContext.Memberships.AddAsync(membership);
        await _dbContext.SaveChangesAsync();

        return Ok(new { slug = community.Slug });
    }

    [HttpGet]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetCommunities()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(userIdClaim, out var userGuid);

        var communities = await _dbContext.Communities
            .AsNoTracking()
            .Select(c => new CommunityResponse
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Slug = c.Slug,
                Photo = c.Photo,
                CreatorId = c.CreatorId,
                CreatedAt = c.CreatedAt,
                MemberCount = _dbContext.Memberships.Count(m => m.CommunityId == c.Id),
                IsJoined = _dbContext.Memberships.Any(m => m.CommunityId == c.Id && m.UserId == userGuid)
            })
            .ToListAsync();

        foreach (var c in communities)
        {
            if (c.Photo != null)
            {
                c.Photo = _photoService.BuildUrl(c.Photo);
            }
        }

        return Ok(communities);
    }

    [HttpGet("{slug}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetCommunityBySlug(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(userIdClaim, out var userGuid);

        var community = await _dbContext.Communities
            .AsNoTracking()
            .Where(c => c.Slug == slug)
            .Select(c => new CommunityResponse
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Slug = c.Slug,
                Photo = c.Photo,
                CreatorId = c.CreatorId,
                CreatedAt = c.CreatedAt,
                MemberCount = _dbContext.Memberships.Count(m => m.CommunityId == c.Id),
                IsJoined = _dbContext.Memberships.Any(m => m.CommunityId == c.Id && m.UserId == userGuid),
                UserRole = _dbContext.Memberships
                    .Where(m => m.CommunityId == c.Id && m.UserId == userGuid)
                    .Select(m => m.Role)
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (community == null) return NotFound("Community not found");

        if (community.Photo != null)
        {
            community.Photo = _photoService.BuildUrl(community.Photo);
        }

        return Ok(community);
    }

    [HttpPost("{slug}/join")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> JoinCommunity(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized();
        }

        var community = await _dbContext.Communities
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (community == null) return NotFound("Community not found");

        var existingMembership = await _dbContext.Memberships
            .FirstOrDefaultAsync(m => m.CommunityId == community.Id && m.UserId == userGuid);

        if (existingMembership != null) return BadRequest("Already a member");

        var membership = new CommunityMembership
        {
            Id = Guid.NewGuid(),
            UserId = userGuid,
            CommunityId = community.Id,
            Role = "Member",
            JoinedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Memberships.Add(membership);
        await _dbContext.SaveChangesAsync();

        return Ok("Joined successfully");
    }

    [HttpDelete("{slug}/leave")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> LeaveCommunity(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized();
        }

        var community = await _dbContext.Communities
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (community == null) return NotFound("Community not found");

        var membership = await _dbContext.Memberships
            .FirstOrDefaultAsync(m => m.CommunityId == community.Id && m.UserId == userGuid);

        if (membership == null) return BadRequest("Not a member");
        if (membership.Role == "Owner") return BadRequest("Owner cannot leave their own community");

        _dbContext.Memberships.Remove(membership);
        await _dbContext.SaveChangesAsync();

        return Ok("Left successfully");
    }

    [HttpGet("{slug}/members")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetCommunityMembers(string slug)
    {
        var community = await _dbContext.Communities
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (community == null) return NotFound("Community not found");

        var members = await _dbContext.Memberships
            .AsNoTracking()
            .Where(m => m.CommunityId == community.Id)
            .Join(_dbContext.Users,
                m => m.UserId,
                u => u.Id,
                (m, u) => new UserResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Photo = u.Photo,
                    Role = m.Role
                })
            .ToListAsync();

        foreach (var m in members)
        {
            if (m.Photo != null)
            {
                m.Photo = _photoService.BuildUrl(m.Photo);
            }
        }

        return Ok(members);
    }

    [HttpDelete("{slug}/members/{userId}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> RemoveMember(string slug, Guid userId)
    {
        var currentUserIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(currentUserIdClaim, out var currentUserGuid))
        {
            return Unauthorized();
        }

        var community = await _dbContext.Communities
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (community == null) return NotFound("Community not found");

        var currentMembership = await _dbContext.Memberships
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.CommunityId == community.Id && m.UserId == currentUserGuid);

        if (currentMembership == null || (currentMembership.Role != "Owner" && !User.IsInRole("Admin")))
        {
            return Forbid();
        }

        var targetMembership = await _dbContext.Memberships
            .FirstOrDefaultAsync(m => m.CommunityId == community.Id && m.UserId == userId);

        if (targetMembership == null) return NotFound("Member not found in this community");
        if (targetMembership.Role == "Owner") return BadRequest("Cannot remove the community owner");

        _dbContext.Memberships.Remove(targetMembership);
        await _dbContext.SaveChangesAsync();

        return Ok("Member removed successfully");
    }
}
