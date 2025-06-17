using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

public class Response
{
    [Key]
    public int Id { get; set; }
    public int QCMId { get; set; }
    public string StudentId { get; set; }

    public string SelectedAnswersJson { get; set; } = string.Empty;

    [NotMapped]
    public List<List<int>> SelectedAnswers
    {
        get
        {
            if (string.IsNullOrEmpty(SelectedAnswersJson))
                return new List<List<int>>();
            return JsonSerializer.Deserialize<List<List<int>>>(SelectedAnswersJson) ?? new List<List<int>>();
        }
        set
        {
            SelectedAnswersJson = JsonSerializer.Serialize(value);
        }
    }
}
