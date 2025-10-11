using Api.Data;
using Api.Models;
using Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Api.Service;

public class UserRepository(DataContext context, GroupRepository groupRepository)
{
    public async Task<IEnumerable<User>> GetAllAsync()
    {
           
        return await context.Users.Include(i => i.Group).Select(s => new User()
        {
            Id = s.Id,
            Fullname = s.Fullname,
            GroupId = s.GroupId,
            Group = s.Group,
            Login = s.Login,
            CanDelete = s.CanDelete,
            Role = s.Role,
            Password = ""
        }).ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllForUser(int userId)
    {
        var user =  await context.Users.Where(s => s.Id == userId).FirstOrDefaultAsync();
        if (user == null)
        {
            return null;
        }

        if (user.GroupId == 1)
        {
            return await GetAllAsync();
        }
        var groups = await groupRepository.GetGroupsForUser(userId);
        var groupsId = groups.Select(g => g.Id).ToList();
        
        var users=await context.Users.Include(i => i.Group).Select(s => new User()
                          {
                              Id = s.Id,
                              Fullname = s.Fullname,
                              GroupId = s.GroupId,
                              Group = s.Group,
                              Login = s.Login,
                              CanDelete = s.CanDelete,
                              Role = s.Role,
                              Password = ""
                          }).Where( w=> groupsId.Contains(w.GroupId)).ToListAsync();

        return users;
    }
    
    public async Task<User> GetUserAsync(int id)
    {
        return await context.Users.Include(i => i.Group).Select(s => new User()
        {
            Id = s.Id,
            Fullname = s.Fullname,
            GroupId = s.GroupId,
            Group = s.Group,
            Login = s.Login,
            CanDelete = s.CanDelete,
            Role = s.Role,
            Password = ""
        }).FirstOrDefaultAsync();
    }

    public async Task<User> GetUserAsync(string username, string passwordHash)
    {
        return await context.Users.Include(i => i.Group)
            .FirstOrDefaultAsync(w => w.Login == username.ToLower() && w.Password == passwordHash);
    }

    public async Task<User> AddUserAsync(User user, bool hashPassword = true)
    {
        if (hashPassword)
        {
            user.Password = MD5Utils.CreateMD5(user.Password);
        }

        user.Login = user.Login.ToLower();
        context.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        if (user.Password == "")
        {
            var oldUser = await GetUserAsync(user.Id);
            user.Password = oldUser.Password;
        }
        else
        {
            user.Password = MD5Utils.CreateMD5(user.Password);
        }
        context.Update(user);
        await context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteUser(User user)
    {
        if (!user.CanDelete)
        {
            throw new Exception("Can`t delete this user");
        }

        context.Remove(user);
        await context.SaveChangesAsync();
        return true;
    }
}