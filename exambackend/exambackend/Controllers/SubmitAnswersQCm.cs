using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using exambackend.Models; // Assurez-vous d'importer vos modèles
using System.Threading.Tasks;
using exambackend.Data;

namespace exambackend.Controllers
{
    [ApiController]
    [Route("api/submit")]
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
            if (responseDto == null || responseDto.SelectedAnswers == null || responseDto.SelectedAnswers.Count == 0)
            {
                return BadRequest(new { Message = "Les données de réponse sont invalides." });
            }

            var qcmExists = await _context.QCMs.AnyAsync(q => q.Id == responseDto.QCMId);
            if (!qcmExists)
            {
                return NotFound(new { Message = "QCM non trouvé." });
            }

            if (string.IsNullOrEmpty(responseDto.StudentId))
            {
                return BadRequest(new { Message = "L'identifiant de l'étudiant est requis." });
            }

            var response = new Response
            {
                QCMId = responseDto.QCMId,
                StudentId = responseDto.StudentId,  // ici, bien utiliser l'ID numérique
                SelectedAnswers = responseDto.SelectedAnswers
            };

            await _context.Responses.AddAsync(response);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Réponses soumises avec succès." });
        }


    }
}
