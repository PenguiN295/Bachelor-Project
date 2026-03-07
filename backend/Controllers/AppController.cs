namespace backend.Controllers;

using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Interfaces;
using Mapster;

[ApiController]

public class AppController : ControllerBase
{
    public AppDbContext _dbContext;
    public IPhotoService _photoService;
    public AppController(AppDbContext dbContext, IPhotoService photoService)
    {
        _dbContext = dbContext;
        _photoService = photoService;
    }
    [HttpPost("create-event")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateEvent([FromForm] EventRequest newEvent)
    {
        Console.WriteLine(newEvent.Title);
        if (newEvent == null)
        {
            return BadRequest("Event is null");
        }
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        string? imageUrl = null;
        if (newEvent.ImageFile != null)
        {
            var result = await _photoService.AddPhotoAsync(newEvent.ImageFile);
            imageUrl = result.PublicId;
        }

        var eventEntity = new Event
        {
            Id = Guid.NewGuid(),
            Title = newEvent.Title,
            Description = newEvent.Description,
            StartAt = newEvent.StartAt.ToUniversalTime(),
            EndAt = newEvent.EndAt.ToUniversalTime(),
            MaxAttendees = newEvent.MaxAttendees,
            CurrentAttendees = 0,
            Price = newEvent.Price,
            Latitude = newEvent.Latitude,
            Longitude = newEvent.Longitude,
            City = newEvent.City,
            County = newEvent.County,
            CreatorId = userGuid,
            ImageUrl = imageUrl
        };

        foreach (var id in newEvent.CategoryIds)
        {
            var trackedCategory = _dbContext.Categories.Local.FirstOrDefault(c => c.Id == id);

            if (trackedCategory == null)
            {
                trackedCategory = new Category { Id = id };
                _dbContext.Categories.Attach(trackedCategory);
            }

            eventEntity.Categories.Add(trackedCategory);

        }
        eventEntity.Slug = SlugService.Generate(eventEntity.Title, eventEntity.Id);
        await _dbContext.Events.AddAsync(eventEntity);
        await _dbContext.SaveChangesAsync();

        return Ok("Event created successfully");
    }
    [HttpGet("event/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetEventBySlug(string slug)
    {
        var eventEntity = await _dbContext.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Slug == slug);
        if (eventEntity == null)
        {
            return NotFound("Event not found");
        }
        if (eventEntity.ImageUrl != null)
            eventEntity.ImageUrl = _photoService.BuildUrl(eventEntity.ImageUrl);
        return Ok(eventEntity);
    }
    [HttpGet("events")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetEvents([FromQuery] FilterRequest filter)
    {
        IQueryable<Event> query = _dbContext.Events.AsNoTracking();
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        if (filter.AllFieldsEmpty())
        {
            var results = await query.ToListAsync();
            return Ok(results);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            query = query.Where(e => EF.Functions.ILike(e.Title, $"%{filter.Search}%"));
        }

        if (filter.StartDate != default)
        {
            query = query.Where(e => e.StartAt == filter.StartDate.Date);
        }
        if (filter.Price > 0)
        {
            query = query.Where(e => e.Price <= filter.Price);
        }

        if (!string.IsNullOrWhiteSpace(filter.Location))
        {
            query = query.Where(e => EF.Functions.ILike(e.City, $"%{filter.Location}%") || EF.Functions.ILike(e.County, $"%{filter.Location}%"));
        }
        if (filter.ShowFull == false)
        {
            query = query.Where(e => e.CurrentAttendees < e.MaxAttendees);
        }
        if (filter.CreatedByMe == true)
        {
            query = query.Where(e => e.CreatorId == userGuid);
        }
        if (filter.CategoryIds != null && filter.CategoryIds.Any())
        {
            query = query.Where(e => e.Categories.Any(c => filter.CategoryIds.Contains(c.Id)));
        }
        int pageSize = 50;
        int skip = (filter.Page - 1) * pageSize;

        var filteredResults = await query.OrderByDescending(e => e.StartAt).Skip(skip).Take(pageSize).ToListAsync();
        filteredResults.ForEach(e => e.ImageUrl = e.ImageUrl != null ? e.ImageUrl = _photoService.BuildUrl(e.ImageUrl) : null);
        return Ok(filteredResults);
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
        return Ok(new { user.Username });
    }
    [HttpPost("subscribe")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> SubscribeToEvent([FromBody] SubscribeRequest sr)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var existingSub = await _dbContext.Subscriptions
        .FirstOrDefaultAsync(s => s.UserId == userGuid && s.EventId == sr.EventId);
        if (sr.Subscribe)
        {
            if (existingSub != null)
                return BadRequest("Already subscribed to this event.");

            var newSubscription = new EventSubscription
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                EventId = sr.EventId,
            };

            _dbContext.Subscriptions.Add(newSubscription);
        }
        else
        {
            if (existingSub == null)
                return BadRequest("Not currently subscribed to this event.");

            _dbContext.Subscriptions.Remove(existingSub);
        }
        await _dbContext.SaveChangesAsync();
        var ev = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == sr.EventId);
        if (ev != null)
        {
            ev.CurrentAttendees = await _dbContext.Subscriptions
                .CountAsync(s => s.EventId == sr.EventId);

            await _dbContext.SaveChangesAsync();
        }
        return Ok(sr.Subscribe ? new { message = "Subscribed successfully" } : new { message = "Unsubscribed successfully" });
    }
    [HttpGet("subscribed-status/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> IsSubscribed(string slug)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return BadRequest("Event slug can't be empty");
        }
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var ev = await _dbContext.Events.FirstOrDefaultAsync(e => e.Slug == slug);
        if (ev == null)
        {
            return NotFound("Event not found");
        }
        var existingSub = await _dbContext.Subscriptions
       .FirstOrDefaultAsync(s => s.UserId == userGuid && s.EventId == ev.Id);
        if (existingSub != null)
        {
            return Ok(new { status = "Subscribed" });
        }
        return Ok(new { status = "Not Subscribed" });
    }
    [HttpGet("ownership-status/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> IsOwner(string slug)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return BadRequest("Event slug can't be empty");
        }
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var ev = await _dbContext.Events.FirstOrDefaultAsync(e => e.CreatorId == userGuid && e.Slug == slug);
        if (ev != null)
        {
            return Ok(new { status = "Owner" });
        }
        return Ok(new { status = "Not Owner" });
    }
    [HttpPut("update-event/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> UpdateEvent([FromBody] EventRequest eventRequest, string slug)
    {
        if (eventRequest == null)
        {
            return BadRequest("Request can't be empty");
        }
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Slug == slug);
        if (existingEvent == null)
        {
            return BadRequest("Event not found");
        }
        if (existingEvent.CreatorId != userGuid)
        {
            return Forbid("You are not authorized to delete this event");
        }
        eventRequest.CreatorId = userGuid;
        eventRequest.ImageFile = null;
        eventRequest.CurrentAttendees = existingEvent.CurrentAttendees;
        eventRequest.Adapt(existingEvent);
        _dbContext.Events.Update(existingEvent);
        await _dbContext.SaveChangesAsync();
        return Ok(new { status = "Saved" });
    }
    [HttpDelete("delete-event/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> DeleteEvent(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Slug == slug);
        if (existingEvent == null)
        {
            return BadRequest("Event not found");
        }
        if (existingEvent.CreatorId != userGuid)
        {
            return Forbid("You are not authorized to update this event");
        }
        if (existingEvent.ImageUrl != null)
        {
            try
            {
                await _photoService.DeletePhotoAsync(existingEvent.ImageUrl);
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to delete associated photo: " + ex.Message);
            }
        }
        _dbContext.Events.Remove(existingEvent);
        await _dbContext.SaveChangesAsync();
        return Ok(new { status = "Deleted" });
    }
    [HttpGet("categories")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _dbContext.Categories.AsNoTracking().Select(c => new CategoryResponse
        {
            Id = c.Id,
            Name = c.Name
        }).ToListAsync();
        return Ok(categories);
    }

}