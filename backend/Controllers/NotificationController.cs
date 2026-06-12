using backend.Data;
using backend.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize(Roles = "User,Admin")]
public class NotificationController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public NotificationController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var notifications = await _dbContext.Notifications
            .AsNoTracking()
            .Where(n => n.UserId == userGuid)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponse
            {
                Id = n.Id,
                ActorId = n.ActorId,
                Type = n.Type,
                ReferenceId = n.ReferenceId,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(notifications);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userGuid);
        if (notification == null) return NotFound("Notification not found");

        notification.IsRead = true;
        await _dbContext.SaveChangesAsync();

        return Ok(new { status = "Read" });
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        await _dbContext.Notifications
            .Where(n => n.UserId == userGuid && !n.IsRead)
            .ExecuteUpdateAsync(n => n.SetProperty(x => x.IsRead, true));

        return Ok(new { status = "All marked as read" });
    }
}