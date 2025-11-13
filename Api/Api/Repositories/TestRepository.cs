using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class TestRepository(DataContext context)
{
    public async Task<IEnumerable<Test>> GetAll()
    {
        return await context.Tests.Include(i => i.Parts).ToListAsync();
    }
}