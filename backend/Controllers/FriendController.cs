using backend.Data;
using backend.Data.Entities;
using backend.Hubs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/friends")]
[Authorize(Roles = "User,Admin")]
public class FriendController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<AppHub> _hubContext;
    private readonly IPhotoService _photoService;

    public FriendController(AppDbContext dbContext, IHubContext<AppHub> hubContext, IPhotoService photoService)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var friendships = await _dbContext.Friendships
            .AsNoTracking()
            .Where(f => (f.RequesterId == userGuid || f.ReceiverId == userGuid) && f.Status == "Accepted")
            .ToListAsync();

        var friendUserIds = friendships
            .Select(f => f.RequesterId == userGuid ? f.ReceiverId : f.RequesterId)
            .ToList();

        var friendUsers = await _dbContext.Users
            .AsNoTracking()
            .Where(u => friendUserIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        var result = new List<FriendResponse>();

        foreach (var f in friendships)
        {
            var friendId = f.RequesterId == userGuid ? f.ReceiverId : f.RequesterId;
            if (friendUsers.TryGetValue(friendId, out var friendUser))
            {
                result.Add(new FriendResponse
                {
                    Id = f.Id,
                    UserId = friendUser.Id,
                    Username = friendUser.Username,
                    Photo = friendUser.Photo != null ? _photoService.BuildUrl(friendUser.Photo) : null,
                    Status = f.Status,
                    IsRequester = f.RequesterId == userGuid,
                    CreatedAt = f.CreatedAt
                });
            }
        }

        return Ok(result);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingRequests()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var friendships = await _dbContext.Friendships
            .AsNoTracking()
            .Where(f => (f.RequesterId == userGuid || f.ReceiverId == userGuid) && f.Status == "Pending")
            .ToListAsync();

        var friendUserIds = friendships
            .Select(f => f.RequesterId == userGuid ? f.ReceiverId : f.RequesterId)
            .ToList();

        var friendUsers = await _dbContext.Users
            .AsNoTracking()
            .Where(u => friendUserIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id);

        var result = new List<FriendResponse>();

        foreach (var p in friendships)
        {
            var friendId = p.RequesterId == userGuid ? p.ReceiverId : p.RequesterId;
            if (friendUsers.TryGetValue(friendId, out var friendUser))
            {
                result.Add(new FriendResponse
                {
                    Id = p.Id,
                    UserId = friendUser.Id,
                    Username = friendUser.Username,
                    Photo = friendUser.Photo != null ? _photoService.BuildUrl(friendUser.Photo) : null,
                    Status = p.Status,
                    IsRequester = p.RequesterId == userGuid,
                    CreatedAt = p.CreatedAt
                });
            }
        }

        return Ok(result);
    }

    [HttpPost("request/{targetUserId}")]
    public async Task<IActionResult> SendRequest(Guid targetUserId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        if (userGuid == targetUserId) return BadRequest("Cannot send friend request to yourself");

        var targetUser = await _dbContext.Users.FindAsync(targetUserId);
        if (targetUser == null) return NotFound("User not found");

        var existing = await _dbContext.Friendships.FirstOrDefaultAsync(f => 
            (f.RequesterId == userGuid && f.ReceiverId == targetUserId) ||
            (f.RequesterId == targetUserId && f.ReceiverId == userGuid));

        if (existing != null) return BadRequest("Friendship or request already exists");

        var friendship = new Friendship
        {
            Id = Guid.NewGuid(),
            RequesterId = userGuid,
            ReceiverId = targetUserId,
            Status = "Pending",
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Friendships.Add(friendship);

        var requester = await _dbContext.Users.FindAsync(userGuid);
        
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = targetUserId,
            ActorId = userGuid,
            Type = "FriendRequest",
            ReferenceId = friendship.Id.ToString(),
            Message = $"{requester?.Username} sent you a friend request",
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Notifications.Add(notification);
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.User(targetUserId.ToString()).SendAsync("ReceiveNotification", notification);

        return Ok("Friend request sent");
    }

    [HttpPost("accept/{friendshipId}")]
    public async Task<IActionResult> AcceptRequest(Guid friendshipId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var friendship = await _dbContext.Friendships.FindAsync(friendshipId);
        if (friendship == null) return NotFound("Friend request not found");

        if (friendship.ReceiverId != userGuid) return Forbid("You can only accept requests sent to you");
        if (friendship.Status != "Pending") return BadRequest("Request is not pending");

        friendship.Status = "Accepted";

        var receiver = await _dbContext.Users.FindAsync(userGuid);
        
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = friendship.RequesterId,
            ActorId = userGuid,
            Type = "FriendAccept",
            ReferenceId = friendship.Id.ToString(),
            Message = $"{receiver?.Username} accepted your friend request",
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Notifications.Add(notification);
        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.User(friendship.RequesterId.ToString()).SendAsync("ReceiveNotification", notification);
        await _hubContext.Clients.User(friendship.RequesterId.ToString()).SendAsync("FriendRequestAccepted", friendshipId);

        return Ok("Friend request accepted");
    }

    [HttpPost("reject/{friendshipId}")]
    public async Task<IActionResult> RejectRequest(Guid friendshipId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var friendship = await _dbContext.Friendships.FindAsync(friendshipId);
        if (friendship == null) return NotFound("Friend request not found");

        if (friendship.ReceiverId != userGuid) return Forbid("You can only reject requests sent to you");

        _dbContext.Friendships.Remove(friendship);
        await _dbContext.SaveChangesAsync();

        return Ok("Friend request rejected");
    }

    [HttpDelete("remove/{friendshipId}")]
    public async Task<IActionResult> RemoveFriend(Guid friendshipId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var friendship = await _dbContext.Friendships.FindAsync(friendshipId);
        if (friendship == null) return NotFound("Friendship not found");

        if (friendship.RequesterId != userGuid && friendship.ReceiverId != userGuid) 
            return Forbid("You are not part of this friendship");

        _dbContext.Friendships.Remove(friendship);
        await _dbContext.SaveChangesAsync();

        return Ok("Friend removed");
    }
}