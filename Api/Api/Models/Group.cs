namespace Api.Models;

public class Group
{
    public int Id { get; set; }
    public string Title { get; set; }   
    public int ParentId { get; set; }
    public bool CanDelete { get; set; } = true;
    
    public ICollection<Test> Tests { get; set; }
    
}
