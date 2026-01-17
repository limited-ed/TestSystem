using System;
using System.Reflection;
using System.Text.Json.Serialization;

namespace Api.Models;

public class Question
{
    public int Id { get; set; }
    public string Content { get; set; }
    public int CategoryId { get; set; }
    [JsonIgnore]
    public Category Category { get; set; }
    
    public int? ImageId { get; set; }
    [JsonIgnore]
    public Image Image { get; set; }
    public IList<Answer> Answers { get; set; }
}
