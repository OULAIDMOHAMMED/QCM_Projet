using System.ComponentModel.DataAnnotations;

namespace exambackend.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }
        public required string QuestionText { get; set; }
        public List<string> Answers { get; set; } = new List<string>();
        public List<int> CorrectIndexes { get; set; } = new List<int>(); // Indices des réponses correctes
    }

}
