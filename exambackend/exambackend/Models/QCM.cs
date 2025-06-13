
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace exambackend.Models;
public class QCM
{
    [Key]
    public int Id { get; set; }
    public required string Title { get; set; }

    [ForeignKey("User")]
    public int TeacherId { get; set; } // Référence au professeur
    public User Teacher { get; set; } // Utilisateur qui a créé le QCM

    public List<Question> Questions { get; set; } = new List<Question>(); // Liste des questions
}

