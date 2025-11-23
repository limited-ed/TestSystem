using Microsoft.EntityFrameworkCore;

namespace Api.Models;

[Index(nameof(Id), nameof(QuestionId), nameof(TestId))]
public class ResultItem
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; }
    public int TestId { get; set; }
    public User Test { get; set; }
    public ICollection<int> Answers { get; set; }
    public bool Right { get; set; }
    
}