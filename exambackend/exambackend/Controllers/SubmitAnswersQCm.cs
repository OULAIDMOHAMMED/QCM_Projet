using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using exambackend.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using exambackend.Data;

namespace exambackend.Controllers
{
    [ApiController]
    [Route("api/submit")]
    public class SubmitAnswersQCm : ControllerBase
    {
        private readonly AppDbContext _context;

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

            // Vérifie que StudentId est positif (id valide)
            if (responseDto.StudentId <= 0)
            {
                return BadRequest(new { Message = "L'identifiant de l'étudiant est requis et doit être positif." });
            }

            var qcm = await _context.QCMs
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == responseDto.QCMId);

            if (qcm == null)
            {
                return NotFound(new { Message = "QCM non trouvé." });
            }

            double totalQuestions = qcm.Questions.Count;
            double correctCount = 0;

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
                Note = finalScore,
                // Si tes propriétés de navigation sont required, pense à les initialiser ou à les rendre nullable dans ta classe Response
            };

            await _context.Responses.AddAsync(response);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Réponses soumises avec succès.",
                Note = finalScore
            });
        }
        [HttpGet("results/{teacherId}")]
        public async Task<ActionResult> GetQCMResultsForTeacher(int teacherId)
        {
            // Récupère tous les QCMs du prof
            var qcmList = await _context.QCMs
                .Where(q => q.TeacherId == teacherId)
                .ToListAsync();

            var qcmIds = qcmList.Select(q => q.Id).ToList();

            // Récupère les réponses liées à ces QCMs
            var responses = await _context.Responses
                .Where(r => qcmIds.Contains(r.QCMId))
                .Include(r => r.Student)
                .ToListAsync();

            // Assemble les résultats
            var result = qcmList.Select(qcm => new
            {
                QCMId = qcm.Id,
                QCMTitle = qcm.Title,
                Responses = responses
                    .Where(r => r.QCMId == qcm.Id)
                    .Select(r => new
                    {
                        StudentId = r.StudentId,
                        StudentName = r.Student != null ? r.Student.name: "Inconnu",
                        Note = r.Note
                    }).ToList()
            });

            return Ok(result);
        }
        [HttpGet("passed/{studentId}")]
        public async Task<IActionResult> GetPassedQCMs(int studentId)
        {
            var passedQCMs = await _context.Responses
                .Where(s => s.StudentId == studentId)
                .Select(s => s.QCMId)
                .Distinct()
                .ToListAsync();

            var qcms = await _context.QCMs
                .Where(q => passedQCMs.Contains(q.Id))
                .Select(q => new {
                    q.Id,
                    q.Title
                })
                .ToListAsync();

            return Ok(qcms);
        }

        [HttpGet("history/{studentId}/{qcmId}")]
        public async Task<IActionResult> GetStudentQcmHistory(int studentId, int qcmId)
        {
            var response = await _context.Responses
                .FirstOrDefaultAsync(r => r.StudentId == studentId && r.QCMId == qcmId);

            if (response == null)
                return NotFound(new { Message = "Aucune réponse trouvée pour cet étudiant et ce QCM." });

            var qcm = await _context.QCMs
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == qcmId);

            if (qcm == null)
                return NotFound(new { Message = "QCM introuvable." });

            var questions = qcm.Questions.Select((q, index) => new
            {
                text = q.QuestionText,
                answers = q.Answers,
                correctIndexes = q.CorrectIndexes ?? new List<int>(),
                selectedIndexes = (index < response.SelectedAnswers.Count) ? response.SelectedAnswers[index] : new List<int>()
            }).ToList();

            return Ok(new
            {
                title = qcm.Title,
                note = response.Note,
                questions = questions
            });
        }

    }
}
