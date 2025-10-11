using System;
using System.Data;
using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace Api.Repositories;

public class CategoriesRepository
{
    private readonly DataContext _context;

    public CategoriesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IList<Category>> GetAll()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<IList<Category>> GetForUser(int userId)
    {
        var user = await _context.Users.FirstAsync();
        if (user.GroupId == 1)
        {
            return await _context.Categories.ToListAsync();
        }
        else
        {
            return await _context.Categories.Where(w => w.UserId == userId || user.GroupId == 1).ToListAsync();
        }
    }

    public async Task<Category> GetCategoryAsync(int id)
    {
        return await _context.Categories.FirstOrDefaultAsync(f => f.Id == id);
    }

    public async Task<Category> AddCategory(Category category, int userId)
    {
        category.UserId = userId;
        _context.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category> UpdateCategory(Category category, int userId)
    {
        var oldCategory = await _context.Categories.AsNoTracking().FirstAsync(f => f.Id == category.Id);
        var user = _context.Users.First(f => f.Id == userId);
        if ((oldCategory.UserId != category.UserId && category.UserId != userId) || user.GroupId != 1)
        {
            throw new DataException("Invalid UserId");
        }


        _context.Update(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task DeleteCategory(int id, int userId)
    {
        var category = await _context.Categories.FirstAsync(f => f.Id == id);
        if (category.UserId != userId)
        {
            throw new DataException("Invalid UserId");
        }

        if (!_context.Categories.Any(c => c.Id == id))
        {
            throw new DataException("Not Found");
        }

        _context.Remove(category);
        await _context.SaveChangesAsync();
    }
}