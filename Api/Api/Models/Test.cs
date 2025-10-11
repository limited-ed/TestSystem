using System;
using System.Text.Json.Serialization;

namespace Api.Models;

public class Test
{
    public int Id { get; set; }
    public List<TestPart> Parts { get; set; }   
    public int Timer { get; set; }
    public ICollection<Group> Groups { get; set; }
    public int UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; }
}
