
using System.Text.Json.Serialization;
using Api.Models;
using Api.Models.Auth;

public class User
{
    public int Id { get; set; }
    public string Login { get; set; }
    public string Password { get; set; }
    public string Fullname { get; set; }
    public UserRole Role { get; set; }
    public int GroupId { get; set; }
    [JsonIgnore]
    public Group Group { get; set; }
    public bool CanDelete { get; set; } 
        
}