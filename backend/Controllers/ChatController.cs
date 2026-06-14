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
[Route("api/chat")]
[Authorize(Roles = "User,Admin")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<AppHub> _hubContext;
    private readonly IPhotoService _photoService;

    public ChatController(AppDbContext dbContext, IHubContext<AppHub> hubContext, IPhotoService photoService)
    {
        _dbContext = dbContext;
        _hubContext = hubContext;
        _photoService = photoService;
    }

    [HttpGet("partners")]
    public async Task<IActionResult> GetChatPartners()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        // Get all accepted friends
        var friends = await _dbContext.Friendships
            .AsNoTracking()
            .Where(f => (f.RequesterId == userGuid || f.ReceiverId == userGuid) && f.Status == "Accepted")
            .Select(f => f.RequesterId == userGuid ? f.ReceiverId : f.RequesterId)
            .ToListAsync();

        var partnersRaw = await _dbContext.Users
            .AsNoTracking()
            .Where(u => friends.Contains(u.Id))
            .Select(u => new
            {
                Id = u.Id,
                Username = u.Username,
                Photo = u.Photo,
                UnreadCount = _dbContext.ChatMessages.Count(m => m.SenderId == u.Id && m.ReceiverId == userGuid && !m.IsRead),
                LastMessage = _dbContext.ChatMessages
                    .Where(m => (m.SenderId == userGuid && m.ReceiverId == u.Id) || (m.SenderId == u.Id && m.ReceiverId == userGuid))
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => m.Content)
                    .FirstOrDefault(),
                LastMessageAt = _dbContext.ChatMessages
                    .Where(m => (m.SenderId == userGuid && m.ReceiverId == u.Id) || (m.SenderId == u.Id && m.ReceiverId == userGuid))
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => (DateTimeOffset?)m.CreatedAt)
                    .FirstOrDefault()
            })
            .OrderByDescending(p => p.LastMessageAt)
            .ToListAsync();

        var partners = partnersRaw.Select(p => new
        {
            p.Id,
            p.Username,
            Photo = p.Photo != null ? _photoService.BuildUrl(p.Photo) : null,
            p.UnreadCount,
            p.LastMessage,
            p.LastMessageAt
        }).ToList();

        return Ok(partners);
    }

    [HttpGet("conversation/{partnerId}")]
    public async Task<IActionResult> GetConversation(Guid partnerId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var messages = await _dbContext.ChatMessages
            .AsNoTracking()
            .Where(m => (m.SenderId == userGuid && m.ReceiverId == partnerId) || (m.SenderId == partnerId && m.ReceiverId == userGuid))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatMessageResponse
            {
                Id = m.Id,
                SenderId = m.SenderId,
                ReceiverId = m.ReceiverId,
                Content = m.Content,
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        // Check if they are friends
        var isFriends = await _dbContext.Friendships.AnyAsync(f => 
            ((f.RequesterId == userGuid && f.ReceiverId == request.ReceiverId) || 
             (f.RequesterId == request.ReceiverId && f.ReceiverId == userGuid)) && 
             f.Status == "Accepted");

        if (!isFriends) return Forbid("You can only message friends.");

        var message = new ChatMessage
        {
            Id = Guid.NewGuid(),
            SenderId = userGuid,
            ReceiverId = request.ReceiverId,
            Content = request.Content,
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.ChatMessages.Add(message);
        await _dbContext.SaveChangesAsync();

        var response = new ChatMessageResponse
        {
            Id = message.Id,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            Content = message.Content,
            IsRead = message.IsRead,
            CreatedAt = message.CreatedAt
        };

        await _hubContext.Clients.User(request.ReceiverId.ToString()).SendAsync("ReceiveMessage", response);

        // Optionally, send a generic notification if we wanted to
        // But normally chat has its own badge

        return Ok(response);
    }

    [HttpPut("read/{partnerId}")]
    public async Task<IActionResult> MarkAsRead(Guid partnerId)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        await _dbContext.ChatMessages
            .Where(m => m.SenderId == partnerId && m.ReceiverId == userGuid && !m.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.IsRead, true));

        return Ok("Messages marked as read");
    }
}

public class SendMessageRequest
{
    public Guid ReceiverId { get; set; }
    public string Content { get; set; } = null!;
}