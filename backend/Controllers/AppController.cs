namespace backend.Controllers;

using System.Collections.Generic;
using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Reflection;
using backend.Interfaces;

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
        var result = await _photoService.AddPhotoAsync(newEvent.ImageFile);

        if (result.Error != null)
            return BadRequest(result.Error.Message);
        var eventEntity = new Event
        {
            Id = Guid.NewGuid(),
            Title = newEvent.Title,
            Description = newEvent.Description,
            StartDate = DateOnly.FromDateTime(newEvent.StartDate),
            EndDate = DateOnly.FromDateTime(newEvent.EndDate),
            MaxAttendees = newEvent.MaxAttendees,
            CurrentAttendees = 0,
            Price = newEvent.Price,
            Location = newEvent.Location,
            CreatorId = userGuid,
            ImageUrl = result.SecureUrl.AbsoluteUri
        };
        await _dbContext.Events.AddAsync(eventEntity);
        await _dbContext.SaveChangesAsync();
        return Ok(newEvent);
    }
    [HttpGet("event/{id}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetEventById(Guid id)
    {
        var eventEntity = await _dbContext.Events.FindAsync(id);
        if (eventEntity == null)
        {
            return NotFound("Event not found");
        }
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
            query = query.Where(e => e.Title.Contains(filter.Search));
        }

        if (filter.StartDate != default)
        {
            query = query.Where(e => e.StartDate == filter.StartDate);
        }
        if (filter.Price > 0)
        {
            query = query.Where(e => e.Price <= filter.Price);
        }

        if (!string.IsNullOrWhiteSpace(filter.Location))
        {
            query = query.Where(e => e.Location.Contains(filter.Location));
        }
        if (filter.ShowFull == false)
        {
            query = query.Where(e => e.CurrentAttendees < e.MaxAttendees);
        }
        if (filter.CreatedByMe == true)
        {
            query = query.Where(e => e.CreatorId == userGuid);
        }
        int pageSize = 50;
        int skip = (filter.Page - 1) * pageSize;

        var filteredResults = await query.OrderByDescending(e => e.StartDate).Skip(skip).Take(pageSize).ToListAsync();

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
        return Ok(sr.Subscribe ? "Subscribed successfully" : "Unsubscribed successfully");
    }
}