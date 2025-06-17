using System.ComponentModel.DataAnnotations;

namespace exambackend.Models
{
    public class Response
    {
        [Key]
        public int Id { get; set; }
        public required int QCMId { get; set; } // Référence au QCM
        public required string StudentId { get; set; } // Référence à l'étudiant
        public List<int> SelectedAnswers { get; set; } = new List<int>();
    }
}
