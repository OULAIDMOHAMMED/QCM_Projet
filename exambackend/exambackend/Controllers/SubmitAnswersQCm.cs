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

            var qcm = await _context.QCMs
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == responseDto.QCMId);

            if (qcm == null)
            {
                return NotFound(new { Message = "QCM non trouvé." });
            }

            if (string.IsNullOrEmpty(responseDto.StudentId))
            {
                return BadRequest(new { Message = "L'identifiant de l'étudiant est requis." });
            }

            double totalQuestions = qcm.Questions.Count;
            double correctCount = 0;

            // Fonction locale pour comparer deux listes d'entiers
            bool AreEqual(List<int> a, List<int> b)
            {
                if (a == null && b == null) return true;
                if (a == null || b == null) return false;
                if (a.Count != b.Count) return false;
                for (int j = 0; j < a.Count; j++)
                {
                    if (a[j] != b[j])
                        return false;
                }
                return true;
            }

            for (int i = 0; i < qcm.Questions.Count; i++)
            {
                var expected = qcm.Questions[i].CorrectIndexes?.OrderBy(x => x).ToList() ?? new List<int>();
                var actual = (i < responseDto.SelectedAnswers.Count) ? responseDto.SelectedAnswers[i]?.OrderBy(x => x).ToList() ?? new List<int>() : new List<int>();

                if (AreEqual(expected, actual))
                {
                    correctCount++;
                }
            }

            double finalScore = totalQuestions > 0 ? (correctCount / totalQuestions) * 20 : 0;

            var response = new Response
            {
                QCMId = responseDto.QCMId,
                StudentId = responseDto.StudentId,
                SelectedAnswers = responseDto.SelectedAnswers,
                Note = finalScore
            };

            await _context.Responses.AddAsync(response);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Réponses soumises avec succès.",
                Note = finalScore
            });
        }




    }
}
