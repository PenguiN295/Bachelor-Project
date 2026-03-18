using backend.Data;
using backend.Data.Entities;
using backend.Interfaces;
using backend.Services;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("")]
public class EventController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IPhotoService _photoService;

    public EventController(AppDbContext dbContext, IPhotoService photoService)
    {
        _dbContext = dbContext;
        _photoService = photoService;
    }

    [HttpPost("create-event")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateEvent([FromForm] EventRequest newEvent)
    {
        if (newEvent == null)
        {
            return BadRequest("Event is null");
        }

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }

        if (newEvent.CommunityId.HasValue)
        {
            var isMember = await _dbContext.Memberships
                .AnyAsync(m => m.CommunityId == newEvent.CommunityId.Value && m.UserId == userGuid);
            
            if (!isMember)
            {
                return Forbid("You must be a member of the community to create events for it.");
            }
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
            Location = new Point(newEvent.Longitude, newEvent.Latitude)
            {
                SRID = 4326
            },
            City = newEvent.City,
            County = newEvent.County,
            CreatorId = userGuid,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = DateTimeOffset.UtcNow,
            ImageUrl = imageUrl,
            IsPublic = newEvent.IsPublic,
            CommunityId = newEvent.CommunityId
        };

        if (newEvent.CategoryIds != null)
        {
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
        }

        eventEntity.Slug = SlugService.Generate(eventEntity.Title, eventEntity.Id);
        await _dbContext.Events.AddAsync(eventEntity);
        await _dbContext.SaveChangesAsync();

        return Ok(new { slug = eventEntity.Slug });
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

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            query = query.Where(e => EF.Functions.ILike(e.Title, $"%{filter.Search}%"));
        }

        if (filter.StartDate != default)
        {
            var utcDate = DateTime.SpecifyKind(filter.StartDate.Date, DateTimeKind.Utc);
            query = query.Where(e => e.StartAt >= utcDate);
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
        if (filter.SeePrivate == false)
        {
            query = query.Where(e => e.IsPublic);
        }
        if (filter.CreatedByMe == true)
        {
            query = query.Where(e => e.CreatorId == userGuid);
        }

        if (filter.UserId != null)
        {
            query = query.Where(e => e.CreatorId == filter.UserId);
        }

        if (filter.CommunityId != null)
        {
            query = query.Where(e => e.CommunityId == filter.CommunityId);
        }

        if (filter.CategoryIds != null && filter.CategoryIds.Count > 0)
        {
            query = query.Where(e => e.Categories.Any(c => filter.CategoryIds.Contains(c.Id)));
        }

        int pageSize = 50;
        int skip = (filter.Page - 1) * pageSize;

        var filteredResults = await query.OrderByDescending(e => e.StartAt)
            .Skip(skip)
            .Take(pageSize)
            .ProjectToType<EventResponse>()
            .ToListAsync();

        filteredResults.ForEach(e =>
        {
            if (e.ImageUrl != null)
            {
                e.ImageUrl = _photoService.BuildUrl(e.ImageUrl);
            }
        });

        return Ok(filteredResults);
    }

    [HttpGet("event/{slug}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetEventBySlug(string slug)
    {
        var eventEntity = await _dbContext.Events
            .AsNoTracking()
            .Where(e => e.Slug == slug)
            .ProjectToType<EventResponse>()
            .FirstOrDefaultAsync();

        if (eventEntity == null)
        {
            return NotFound("Event not found");
        }

        if (eventEntity.ImageUrl != null)
        {
            eventEntity.ImageUrl = _photoService.BuildUrl(eventEntity.ImageUrl);
        }

        return Ok(eventEntity);
    }

    [HttpPut("update-event/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> UpdateEvent(string slug, [FromBody] EventRequest eventRequest)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized();
        }

        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Slug == slug);
        if (existingEvent == null) return NotFound();

        if (existingEvent.CreatorId != userGuid) return Forbid();

        if (eventRequest.Title != existingEvent.Title)
        {
            existingEvent.Slug = SlugService.Generate(eventRequest.Title, existingEvent.Id);
        }

        eventRequest.Adapt(existingEvent);
        existingEvent.UpdatedAt = DateTimeOffset.UtcNow;

        _dbContext.Events.Update(existingEvent);
        await _dbContext.SaveChangesAsync();

        return Ok(new { slug = existingEvent.Slug });
    }

    [HttpDelete("delete-event/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> DeleteEvent(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized();
        }

        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Slug == slug);
        if (existingEvent == null) return NotFound();

        if (existingEvent.CreatorId != userGuid) return Forbid();

        if (existingEvent.ImageUrl != null)
        {
            await _photoService.DeletePhotoAsync(existingEvent.ImageUrl);
        }

        _dbContext.Events.Remove(existingEvent);
        await _dbContext.SaveChangesAsync();

        return Ok(new { status = "Deleted" });
    }

    [HttpPost("subscribe")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> SubscribeToEvent([FromBody] SubscribeRequest sr)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized();
        }

        var ev = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == sr.EventId);
        if (ev == null) return NotFound();

        var existingSub = await _dbContext.Subscriptions
            .FirstOrDefaultAsync(s => s.UserId == userGuid && s.EventId == ev.Id);

        if (sr.Subscribe)
        {
            if (existingSub != null) return BadRequest("Already subscribed");
            
            _dbContext.Subscriptions.Add(new EventSubscription
            {
                Id = Guid.NewGuid(),
                UserId = userGuid,
                EventId = ev.Id
            });
        }
        else
        {
            if (existingSub == null) return BadRequest("Not subscribed");
            _dbContext.Subscriptions.Remove(existingSub);
        }

        await _dbContext.SaveChangesAsync();
        ev.CurrentAttendees = await _dbContext.Subscriptions.CountAsync(s => s.EventId == ev.Id);
        await _dbContext.SaveChangesAsync();

        return Ok(new { status = sr.Subscribe ? "Subscribed" : "Unsubscribed" });
    }

    [HttpGet("subscribed-status/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> IsSubscribed(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var ev = await _dbContext.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Slug == slug);
        if (ev == null) return NotFound();

        var isSubscribed = await _dbContext.Subscriptions
            .AnyAsync(s => s.UserId == userGuid && s.EventId == ev.Id);

        return Ok(new { status = isSubscribed ? "Subscribed" : "Not Subscribed" });
    }

    [HttpGet("ownership-status/{slug}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> IsOwner(string slug)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid)) return Unauthorized();

        var ev = await _dbContext.Events.AsNoTracking()
            .FirstOrDefaultAsync(e => e.CreatorId == userGuid && e.Slug == slug);

        return Ok(new { status = ev != null ? "Owner" : "Not Owner" });
    }

    [HttpGet("creator-name/{slug}")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetCreatorName(string slug)
    {
        var eventItem = await _dbContext.Events.AsNoTracking().FirstOrDefaultAsync(e => e.Slug == slug);
        if (eventItem == null) return NotFound();

        var creator = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == eventItem.CreatorId);
        if (creator == null) return NotFound();

        return Ok(new 
        { 
            name = creator.Username, 
            id = creator.Id, 
            photo = creator.Photo != null ? _photoService.BuildUrl(creator.Photo) : null 
        });
    }
}
