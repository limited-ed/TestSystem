using Microsoft.EntityFrameworkCore;

namespace Api.Models;

[Index(nameof(Id), nameof(QuestionId), nameof(TestResultId))]
public class ResultItem
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public Question Question { get; set; }
    public int TestResultId { get; set; }
    public TestResult TestResult { get; set; }
    public ICollection<int> Answers { get; set; }
    public bool Right { get; set; }
    
}