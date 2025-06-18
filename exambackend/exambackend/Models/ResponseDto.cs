public class ResponseDto
{
    public int QCMId { get; set; }
    public int StudentId { get; set; }
    public List<List<int>> SelectedAnswers { get; set; } = new List<List<int>>();
}
