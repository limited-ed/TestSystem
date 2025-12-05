using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Api.Models;
using Api.Models.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class DataContext : DbContext
{
    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Group> Groups { get; set; }
    public virtual DbSet<Category> Categories { get; set; }
    public virtual DbSet<Question> Questions { get; set; }
    public virtual DbSet<Answer> Answers { get; set; }
    public virtual DbSet<Image> QuestionImages { get; set; }
    public virtual DbSet<Test> Tests { get; set; }
    public virtual DbSet<TestPart> TestParts { get; set; }
    public virtual DbSet<GroupTest> GroupsTests { get; set; }
    public virtual DbSet<TestResult> TestResults { get; set; }
    public virtual DbSet<ResultItem> ResultItems { get; set; }

    public DataContext()
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(i => new { i.Id, i.Login });
        modelBuilder.Entity<User>().HasMany(m => m.TestResults).WithOne(o => o.User).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Group>().HasMany(m => m.Users).WithOne(o => o.Group).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<GroupTest>().HasKey(k => new { k.TestId, k.GroupId });
        modelBuilder.Entity<GroupTest>().HasIndex(i => new { i.TestId, i.GroupId });
        modelBuilder.Entity<GroupTest>().HasOne(o => o.Group).WithMany(m => m.GroupTests).HasForeignKey(o => o.GroupId);
        modelBuilder.Entity<GroupTest>().HasOne(o => o.Test).WithMany(m => m.GroupTests).HasForeignKey(o => o.TestId);
        
    }
    
}