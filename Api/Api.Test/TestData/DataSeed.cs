using Api.Data;
using Api.Models;
using Api.Models.Auth;

namespace Api.Test;

public class DataSeed
{
    public static void Seed(DataContext dataContext)
    {
        dataContext.Database.EnsureCreated();
        if (!dataContext.Groups.Any())
        {
            dataContext.Groups.Add(new Group() { Id = 1, Title = "Администраторы", ParentId = 0, CanDelete = false });
            dataContext.Groups.Add(new Group() { Id = 2, Title = "Группа 1", ParentId = 0 });
            dataContext.Groups.Add(new Group() { Id = 3, Title = "Подгруппа", ParentId = 2 });
            dataContext.Groups.Add(new Group() { Id = 4, Title = "Группа 2", ParentId = 0 });
            dataContext.SaveChanges();
        }

        if (!dataContext.Users.Any())
        {
            dataContext.Users.Add(new() { Id = 1, CanDelete = false, Fullname = "Administrator", Login = "admin", Password = MD5Utils.CreateMD5("1"), Role = UserRole.Administrator, GroupId = 1 });
            dataContext.Users.Add(new() { Id = 2, CanDelete = false, Fullname = "Editor", Login = "editor", Password = MD5Utils.CreateMD5("1"), Role = UserRole.Editor, GroupId = 2 });
            dataContext.Users.Add(new() { Id = 3, CanDelete = false, Fullname = "AdminGroup", Login = "admin", Password = MD5Utils.CreateMD5("1"), Role = UserRole.Administrator, GroupId = 2 });
            dataContext.Users.Add(new() { Id = 4, CanDelete = false, Fullname = "User", Login = "user", Password = MD5Utils.CreateMD5("1"), Role = UserRole.User, GroupId = 2 });
            dataContext.Users.Add(new() { Id = 5, CanDelete = false, Fullname = "User2", Login = "user2", Password = MD5Utils.CreateMD5("1"), Role = UserRole.User, GroupId = 3 });
            dataContext.SaveChanges();
        }

    }
}