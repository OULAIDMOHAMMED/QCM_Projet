using exambackend.Data;
using exambackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

            return Ok(new { message = "Connexion réussie", role = user.Role });
        }
    }

}
