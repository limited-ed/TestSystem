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
        var groups = await context.Groups.Where(g => g.ParentId == groupId).ToListAsync();
        /*  if (groups.FirstOrDefault()?.ParentId==0)
          {
              return await GetAllAsync();
          }*/
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
        var user = context.Users.FirstOrDefault(f => f.Id == userId);
        if (user != null)
        {
            var result = new List<Group>();
            result.Add(await context.Groups.FirstAsync(w => w.Id == user.GroupId));
            result.AddRange(await GetChildGroupsAsync(user.GroupId, true));
            return result;
        }

        return null;
    }
    
    
}