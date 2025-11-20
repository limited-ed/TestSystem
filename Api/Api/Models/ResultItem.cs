namespace Api.Models;

public class ResultItem
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; }
    public ICollection<int> Answers { get; set; }
    public bool Right { get; set; }
    
}