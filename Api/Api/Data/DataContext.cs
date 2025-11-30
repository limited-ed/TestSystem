using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Api.Models;
using Api.Models.Auth;
using Api.Utils;
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

    internal async Task Seed()
    {
        if (!Groups.Any())
        {
            Groups.Add(new Group() { Id = 1, Title = "Администраторы", ParentId = 0, CanDelete = false });
            Groups.Add(new Group() { Id = 2, Title = "Группа 1", ParentId = 0 });
            await SaveChangesAsync();
        }

        if (!Users.Any())
        {
            Users.Add(new()
            {
                Id = 1, CanDelete = false, Fullname = "Administrator", Login = "admin",
                Password = MD5Utils.CreateMD5("wt4pk5w4"), Role = UserRole.Administrator, GroupId = 1
            });
            Users.Add(new()
            {
                Id = 2, CanDelete = true, Fullname = "Editor", Login = "editor", Password = MD5Utils.CreateMD5(""),
                Role = UserRole.Editor, GroupId = 2
            });
            Users.Add(new()
            {
                Id = 3, CanDelete = true, Fullname = "User", Login = "user", Password = MD5Utils.CreateMD5("wt4pk5w4"),
                Role = UserRole.User, GroupId = 2
            });
            await SaveChangesAsync();
        }

        if (!Categories.Any())
        {
            Categories.Add(new() { Id = 1, Title = "Вопросы для проверки", UserId = 1 });
            await SaveChangesAsync();
        }
        
        if (!Questions.Any())
        {
            string jsonString = File.ReadAllText("/app/testfile.json");
            var options = new JsonSerializerOptions()
            {
                TypeInfoResolver = new DefaultJsonTypeInfoResolver(),
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
            var data = JsonSerializer.Deserialize<Question[]>(jsonString, options);
            Questions.AddRange(data);

            await SaveChangesAsync();
        }
/*
        if (!Tests.Any())
        {
            Tests.Add(new()
            {
                UserId = 1,
                Title = "Тест для проверки",
                Timer = 15,
                Parts = new()
                {
                    new() { CategoryId = 1, Count = 5 },
                }
            });
            await SaveChangesAsync();
        } */
    }
}