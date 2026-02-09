namespace backend.Controllers;

using System.Collections.Generic;
using Azure.Core;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data.Entities;
using backend.Data;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    
    public ITokenService _tokenService;
    public IPasswordHasher _passwordHasher;
    public AppDbContext _dbContext;
    public AuthController(ITokenService tokenService, IPasswordHasher passwordHasher, AppDbContext dbContext)
    {
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
        _dbContext = dbContext;
    }
    [AllowAnonymous]
    [HttpPost("register")]
    public IActionResult Register([FromBody]RegisterRequest request)
    {
        var hashedPassword = _passwordHasher.HashPassword(request.Password!);
        if(_dbContext.Users.Any(u => u.Email == request.Email))
        {
            return BadRequest("Email already in use");
        }
        if(_dbContext.Users.Any(u => u.Username == request.Username))
        {
            return BadRequest("Username already in use");
        }
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username!,
            PasswordHash = hashedPassword,
            Email = request.Email!,
            Role = "User"
        };

        var token = _tokenService.GenerateToken(user);
        Console.WriteLine("User registered: " + user.Username);
        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return Ok(new { token });
    }
    [HttpPost("login")]
    public IActionResult Login([FromBody]LoginRequest request)
    {
        var user = _dbContext.Users.FirstOrDefault(u => u.Email == request.Email);
        if(user == null)
        {
            return Unauthorized("Invalid email");
        }
        if(!_passwordHasher.VerifyPassword(request.Password!, user.PasswordHash))
        {
            return Unauthorized("Invalid password");
        }
        var token = _tokenService.GenerateToken(user);
        return Ok(new { token });
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("register-admins")]
    public IActionResult RegisterAdmins()
    {
        return Ok("This is an admin endpoint.");
    }
}