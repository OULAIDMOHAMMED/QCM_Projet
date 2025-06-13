using exambackend.Data;
using exambackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace exambackend.Controllers
{
    [Route("api/qcm")]
    [ApiController]
    [Authorize] // Protection globale du contrôleur
    public class QCMController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QCMController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        public async Task<ActionResult<QCM>> CreateQCM([FromBody] QCM qcm)
        {
            // Vérification plus robuste de l'authentification
            if (User.Identity?.IsAuthenticated != true)
            {
                return Unauthorized(new { Message = "Authentification requise" });
            }

            // Gestion sécurisée de l'ID utilisateur
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId) || userId <= 0)
            {
                return BadRequest(new { Message = "Identifiant utilisateur invalide" });
            }

            // Récupération de l'utilisateur avec vérification
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { Message = "Utilisateur non trouvé" });
            }

            // Vérification du rôle
            if (user.Role != "Professor")
            {
                return StatusCode(403, new { Message = "Seuls les enseignants peuvent créer des QCM" });
            }

            // Validation du QCM
            if (qcm == null || string.IsNullOrWhiteSpace(qcm.Title))
            {
                return BadRequest(new { Message = "Les données du QCM sont invalides" });
            }

            // Création sécurisée du QCM
            var newQcm = new QCM
            {
                Title = qcm.Title,
                TeacherId = userId,
                Questions = qcm.Questions ?? new List<Question>()
            };

            try
            {
                _context.QCMs.Add(newQcm);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    actionName: nameof(GetQcmById),
                    routeValues: new { id = newQcm.Id },
                    value: new
                    {
                        Id = newQcm.Id,
                        Title = newQcm.Title,
                        TeacherId = newQcm.TeacherId
                    });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { Message = "Erreur lors de la sauvegarde du QCM", Detail = ex.InnerException?.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QCM>> GetQcmById(int id)
        {
            var qcm = await _context.QCMs
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (qcm == null)
            {
                return NotFound();
            }

            return Ok(qcm);
        }

        [HttpGet("teacher")]
        public async Task<ActionResult<IEnumerable<QCM>>> GetTeacherQcms()
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return BadRequest(new { Message = "Identifiant utilisateur invalide" });
            }

            var qcms = await _context.QCMs
                .Where(q => q.TeacherId == userId)
                .Include(q => q.Questions)
                .ToListAsync();

            return Ok(qcms);
        }
        [HttpGet("all")]
        [Authorize(Roles = "Professor")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllQCMs()
        {
            try
            {
                var qcms = await _context.QCMs
                    .Include(q => q.Questions)
                    .Select(q => new
                    {
                        q.Id,
                        q.Title,
                        TeacherId = q.TeacherId,
                        QuestionsCount = q.Questions.Count,
                        CreationDate = q.CreationDate // Assurez-vous d'avoir ce champ dans votre modèle
                    })
                    .OrderByDescending(q => q.CreationDate)
                    .ToListAsync();

                return Ok(qcms);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Erreur lors de la récupération des QCMs",
                    Detail = ex.Message
                });
            }
        }
    }
}