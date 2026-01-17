using System.Text.Json.Serialization;

namespace Api.Models;

public class TestPart
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    [JsonIgnore]
    public Category Category { get; set; }
    public int Count { get; set; }
    public int TestId { get; set; }
    [JsonIgnore]
    public Test Test { get; set; }
}