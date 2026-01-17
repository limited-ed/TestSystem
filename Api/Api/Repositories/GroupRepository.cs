using System;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace Api.Repositories;

public class GroupRepository(DataContext context) : Controller
{
    public async Task<IEnumerable<Group>> GetAllAsync()
    {
        return await context.Groups.ToListAsync();
    }

    public async Task<IEnumerable<Group>> GetChildGroupsAsync(int groupId, bool setParentNull = false)
    {
        var groups = await context.Groups.Where(g => g.ParentId == groupId).AsNoTracking().ToListAsync();
        if (setParentNull)
        {
            groups.ForEach(f=>f.ParentId=0);
        }
        var result = new List<Group>(groups);
        if (groups.Any())
        {
            foreach (var group in groups)
            {
                var children = await GetChildGroupsAsync(group.Id);
                if (children != null)
                {
                    result.AddRange(children);
                }
            }
        }

        return result;
    }

    public async Task<IEnumerable<Group>> GetGroupsForUser(int userId)
    {
        var user = context.Users.AsNoTracking().FirstOrDefault(f => f.Id == userId);
        if (user != null)
        {
            var result = new List<Group>();
            IEnumerable<Group> root; 
            if (user.GroupId == 1)
            {
                root=context.Groups.Where(w => w.ParentId == 0).AsNoTracking().ToList();
            }
            else
            {
               root = context.Groups.Where(w => w.Id == user.GroupId).AsNoTracking().ToList();
            }

            result.AddRange(root);
            foreach (var g in root)
            {
                result.AddRange(await GetChildGroupsAsync(g.Id, false));
            }

            return result;
        }

        return null;
    }

    public async Task<Group> AddGroup(Group group, int userId)
    {
        var groups = await GetGroupsForUser(userId);
        if (!groups.Any(a => a.Id == group.ParentId))
        {
            throw new ArgumentException();
        }
        
        if (group.Id != 0)
        {
            throw new ArgumentException("Id mas be 0");
        }

        
        context.Add(group);
        await context.SaveChangesAsync();
        return group;
    }

    public async Task<Group> UpdateGroup(Group group, int userId)
    {
        await CheckUserForGroup(group, userId);

        context.Entry(group).State = EntityState.Modified;
        //context.Update(group);
        await context.SaveChangesAsync();
        return group;
    }


    public async Task<bool> Delete(int id, int userId)
    {
        var group = await context.Groups.FirstAsync(f=>f.Id == id);
        await CheckUserForGroup(group, userId);
        if (context.Groups.Any(a => a.ParentId == id))
        {
            throw new InvalidOperationException("Невозможно удалить непустую группу");
        }
        context.Remove(group);
        await context.SaveChangesAsync();
        return true;
    }
    
    private async Task CheckUserForGroup(Group group, int userId)
    {
        var groups = await GetGroupsForUser(userId);
        if (!groups.Any(a => a.Id == group.Id))
        {
            throw new ArgumentException();
        }
    }
    
}