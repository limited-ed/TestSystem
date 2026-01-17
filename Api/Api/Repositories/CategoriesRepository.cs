using System;
using System.Data;
using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace Api.Repositories;

public class CategoriesRepository(DataContext context)
{
    public async Task<IList<Category>> GetAll()
    {
        return await context.Categories.ToListAsync();
    }

    public async Task<IList<Category>> GetForUser(int userId)
    {
        var user = await context.Users.FirstAsync();
        if (user.GroupId == 1)
        {
            return await context.Categories.ToListAsync();
        }
        else
        {
            return await context.Categories.Where(w => w.UserId == userId || user.GroupId == 1).ToListAsync();
        }
    }

    public async Task<Category> GetCategoryAsync(int id)
    {
        return await context.Categories.FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<Category> AddCategory(Category category, int userId)
    {
        category.UserId = userId;
        context.Add(category);
        await context.SaveChangesAsync();
        return category;
    }

    public async Task<Category> UpdateCategory(Category category, int userId)
    {
        var oldCategory = await context.Categories.AsNoTracking().FirstAsync(f => f.Id == category.Id);
        var user = context.Users.First(f => f.Id == userId);
        if ((oldCategory.UserId != category.UserId && category.UserId != userId) || user.GroupId != 1)
        {
            throw new DataException("Invalid UserId");
        }


        context.Update(category);
        await context.SaveChangesAsync();
        return category;
    }

    public async Task DeleteCategory(int id, int userId)
    {
        var category = await context.Categories.FirstAsync(f => f.Id == id);
        if (category.UserId != userId)
        {
            throw new DataException("Invalid UserId");
        }

        if (!context.Categories.Any(c => c.Id == id))
        {
            throw new DataException("Not Found");
        }

        context.Remove(category);
        await context.SaveChangesAsync();
    }
}