namespace exambackend.Models
{
    public class ResponseDto
    {
        public required int QCMId { get; set; }
        public List<int> SelectedAnswers { get; set; }
    }
}
