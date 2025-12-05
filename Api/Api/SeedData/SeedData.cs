using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Api.Data;
using Api.Models;
using Api.Models.Auth;

namespace Api.SeedData;

public static class SeedDataEx
{
    public static async Task SeedData(this DataContext context)
    {
        if (!context.Groups.Any())
        {
            context.Groups.Add(new Group() { Id = 1, Title = "Администраторы", ParentId = 0, CanDelete = false });
            context.Groups.Add(new Group() { Id = 2, Title = "Группа 1", ParentId = 0 });
            await context.SaveChangesAsync();
        }

        if (!context.Users.Any())
        {
            context.Users.Add(new()
            {
                Id = 1, CanDelete = false, Fullname = "Administrator", Login = "admin",
                Password = MD5Utils.CreateMD5("1"), Role = UserRole.Administrator, GroupId = 1
            });
            context.Users.Add(new()
            {
                Id = 2, CanDelete = false, Fullname = "Editor", Login = "editor", Password = MD5Utils.CreateMD5("1"),
                Role = UserRole.Editor, GroupId = 2
            });
            context.Users.Add(new()
            {
                Id = 3, CanDelete = false, Fullname = "User", Login = "user", Password = MD5Utils.CreateMD5("1"),
                Role = UserRole.User, GroupId = 2
            });
            await context.SaveChangesAsync();
        }

        if (!context.Categories.Any())
        {
            context.Categories.Add(new() { Id = 1, Title = "Вопросы для проверки", UserId = 1 });
            await context.SaveChangesAsync();
        }

        if (!context.Questions.Any())
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
            context.Questions.AddRange(data);

            await context.SaveChangesAsync();
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