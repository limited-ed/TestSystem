using System.Text.Json.Serialization;

namespace Api.Models;

public class Group
{
    public int Id { get; set; }
    public string Title { get; set; }   
    public int ParentId { get; set; }
    public bool CanDelete { get; set; } = true;
    
    [JsonIgnore]
    public ICollection<User> Users { get; set; }
    public ICollection<GroupTest> GroupTests { get; set; }
    
    
}
