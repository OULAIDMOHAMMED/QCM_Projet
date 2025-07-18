﻿using exambackend.Data;
using exambackend.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using exambackend.DTO;

namespace exambackend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                    return BadRequest("Email et mot de passe requis");

                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                    return BadRequest("Email déjà utilisé");

                var user = new User
                {
                    name = dto.name?.Trim(),
                    Email = dto.Email.Trim(),
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = string.IsNullOrWhiteSpace(dto.Role) ? "Student" : dto.Role.Trim()
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Inscription réussie", email = user.Email });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, $"Erreur base de données: {dbEx.InnerException?.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur serveur: {ex.Message}");
            }
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.name,
                    u.Email,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Identifiants invalides.");

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                IsPersistent = false, // Ne pas garder après fermeture du navigateur
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(1), // Expiration absolue
                AllowRefresh = false // Empêche le rafraîchissement du cookie
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return Ok(new
            {
                message = "Connexion réussie",
                role = user.Role,
                nameuser=user.name,
                id = user.Id,
                expires = authProperties.ExpiresUtc?.ToString("o")
            });
        }
        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _context.Users
                .Where(u => u.Role == "Student")
                .Select(u => new {
                    u.Id,
                    u.name,
                    u.Email
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "Utilisateur non trouvé" });

            // Mise à jour des champs
            if (!string.IsNullOrWhiteSpace(dto.name))
                user.name = dto.name.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Email))
                user.Email = dto.Email.Trim();

            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Utilisateur mis à jour avec succès" });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour", detail = ex.InnerException?.Message });
            }
        }




        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Déconnexion réussie" });
        }
    }

}
