using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using exambackend.Models; // Assurez-vous d'importer vos modèles
using System.Threading.Tasks;
using exambackend.Data;

namespace exambackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubmitAnswersQCm : ControllerBase
    {
        private readonly AppDbContext _context; // Remplacez par le contexte de votre base de données

        public SubmitAnswersQCm(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("submit")]
        public async Task<ActionResult> SubmitAnswers([FromBody] ResponseDto responseDto)
        {
            // Vérification des données reçues
            if (responseDto == null || responseDto.SelectedAnswers == null || responseDto.SelectedAnswers.Count == 0)
            {
                return BadRequest(new { Message = "Les données de réponse sont invalides." });
            }

            // Vérifiez si le QCM existe
            var qcmExists = await _context.QCMs.AnyAsync(q => q.Id == responseDto.QCMId);
            if (!qcmExists)
            {
                return NotFound(new { Message = "QCM non trouvé." });
            }

            // Créez une nouvelle réponse
            var response = new Response
            {
                QCMId = responseDto.QCMId,
                StudentId = User.Identity.Name, // Assurez-vous que l'utilisateur est authentifié
                SelectedAnswers = responseDto.SelectedAnswers
            };

            // Ajoutez la réponse à la base de données
            await _context.Responses.AddAsync(response);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Réponses soumises avec succès." });
        }
    }
}
