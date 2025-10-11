using System;
using System.Text.Json.Serialization;

namespace Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Title { get; set; }
    public int  UserId { get; set; }
    [JsonIgnore]
    public Group User { get; set; }

    public List<Question> Questions { get; set; }

}
