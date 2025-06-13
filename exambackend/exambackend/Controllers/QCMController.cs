namespace exambackend.Controllers;

using exambackend.Data;
using exambackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class QCMController : ControllerBase
{
    private readonly AppDbContext _context;

    public QCMController(AppDbContext context)
    {
        _context = context;
    }

    // Endpoint pour créer un QCM
    [HttpPost("create")]
    public async Task<ActionResult<QCM>> CreateQCM([FromBody] QCM qcm)
    {
        // Vérifiez que l'utilisateur est authentifié et a le rôle "Teacher"
        var userId = GetUserIdFromClaims(); // Méthode pour obtenir l'ID de l'utilisateur connecté
        var user = await _context.Users.FindAsync(userId);

        if (user == null || user.Role != "Teacher")
        {
            return Unauthorized("Accès refusé. Vous devez être un enseignant pour créer un QCM.");
        }

        qcm.TeacherId = user.Id; // Associer le QCM à l'enseignant
        _context.QCMs.Add(qcm);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateQCM), new { id = qcm.Id }, qcm);
    }

    // Méthode pour obtenir l'ID de l'utilisateur à partir des revendications (claims)
    private int GetUserIdFromClaims()
    {
        // Remplacez ceci par votre méthode d'extraction de l'ID de l'utilisateur à partir des revendications
        return int.Parse(User.FindFirst("Id")?.Value);
    }
}

