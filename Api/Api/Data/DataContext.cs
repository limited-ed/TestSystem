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
            Groups.Add(new Group() { Id = 3, Title = "Подгруппа", ParentId = 2 });
            Groups.Add(new Group() { Id = 4, Title = "Группа 2", ParentId = 0 });
            await SaveChangesAsync();


            await SaveChangesAsync();
        }

        if (!Users.Any())
        {
            Users.Add(new()
            {
                Id = 1, CanDelete = false, Fullname = "Administrator", Login = "admin",
                Password = MD5Utils.CreateMD5("1"), Role = UserRole.Administrator, GroupId = 1
            });
            Users.Add(new()
            {
                Id = 2, CanDelete = false, Fullname = "Editor", Login = "editor", Password = MD5Utils.CreateMD5("1"),
                Role = UserRole.Editor, GroupId = 2
            });
            Users.Add(new()
            {
                Id = 3, CanDelete = false, Fullname = "User", Login = "user", Password = MD5Utils.CreateMD5("1"),
                Role = UserRole.User, GroupId = 3
            });
            Users.Add(new()
            {
                Id = 4, CanDelete = false, Fullname = "User2", Login = "user2", Password = MD5Utils.CreateMD5("1"),
                Role = UserRole.User, GroupId = 3
            });
            await SaveChangesAsync();
        }

        if (!Categories.Any())
        {
            Categories.Add(new() { Id = 1, Title = "Охрана труда", UserId = 1 });
            Categories.Add(new() { Id = 2, Title = "Вопросы Осмотрщик вагонов", UserId = 2 });
            Categories.Add(new() { Id = 3, Title = "Безопасность на жд путях", UserId = 2 });

            await SaveChangesAsync();
        }

        if (!Questions.Any())
        {
            for (int i = 1; i < 20; i++)
            {
                var quest = new Question()
                {
                    Id = i, CategoryId = i - (3 * ((i - 1) / 3)),
                    Content =
                        $"Вопрос {i} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    Answers = new List<Answer>()
                    {
                        new() { Content = "Ответ 1 v", IsRight = true },
                        new() { Content = "Ответ 2", IsRight = false },
                        new() { Content = "Ответ 3 v", IsRight = true },
                        new() { Content = "Ответ 4", IsRight = false }
                    }
                };

                Questions.Add(quest);
            }

            await SaveChangesAsync();
        }

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
        }
    }
}