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


[ApiController]
public class AppController : ControllerBase
{
    public AppDbContext _dbContext;
    public AppController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
   
    [HttpPost("create-event")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateEvent([FromBody] EventRequest newEvent)
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
        var eventEntity = new Event
        {
            Id = Guid.NewGuid(),
            Title = newEvent.Title,
            Description = newEvent.Description,
            StartDate = newEvent.StartDate,
            EndDate = newEvent.EndDate,
            MaxAttendees = newEvent.MaxAttendees,
            CurrentAttendees = 0,
            Price = newEvent.Price,
            Location = newEvent.Location,
            CreatorId = userGuid
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
  //  [Authorize(Roles = "user,admin")]
    public async Task<IActionResult> GetEvents([FromQuery] FilterRequest filter)
    {
        IQueryable<Event> query = _dbContext.Events.AsNoTracking();
        if(filter.AllFieldsEmpty())
        {
            var results = await query.ToListAsync();
            return Ok(results);
        }

        if (!string.IsNullOrWhiteSpace(filter.Title))
        {
            query = query.Where(e => e.Title.Contains(filter.Title));
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
        if(filter.ShowFull == false)
        {
            query = query.Where(e => e.CurrentAttendees < e.MaxAttendees);
        }
        var filteredResults = await query.ToListAsync();

        return Ok(filteredResults);
    }
    [HttpGet("own-events")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetOwnEvents([FromQuery] FilterRequest filter)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userGuid))
        {
            return Unauthorized("Invalid or missing User ID in token.");
        }
        IQueryable<Event> query = _dbContext.Events
            .AsNoTracking()
            .Where(e => e.CreatorId == userGuid);
        if (!string.IsNullOrWhiteSpace(filter.Title))
        {
            query = query.Where(e => e.Title.Contains(filter.Title));
        }

        if (filter.StartDate != default)
        {
            query = query.Where(e => e.StartDate.Date == filter.StartDate.Date);
        }
        query = query.Where(e => e.CurrentAttendees < e.MaxAttendees);

        if (filter.Price > 0)
        {
            query = query.Where(e => e.Price <= filter.Price);
        }

        if (!string.IsNullOrWhiteSpace(filter.Location))
        {
            query = query.Where(e => e.Location.Contains(filter.Location));
        }

        var results = await query.ToListAsync();
        return Ok(results);
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

}