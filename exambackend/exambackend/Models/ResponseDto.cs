public class ResponseDto
{
    public required int QCMId { get; set; }
    public List<int> SelectedAnswers { get; set; } = new List<int>(); // Initialisation par défaut
}
