namespace Api.Models;

public class TestResult
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int TestId { get; set; }
    public Test Test { get; set; }
    public DateTime DateTime { get; set; }
    public int Total { get; set; }
    public int Answered { get; set; }
    public int Right { get; set; }
    public bool Complete { get; set; }
    public ICollection<ResultItem> Results { get; set; }
    
}

