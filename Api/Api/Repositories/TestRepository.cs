using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;
// ReSharper disable  

namespace Api.Repositories;

public class TestRepository(DataContext context)
{
    public async Task<IEnumerable<Test>> GetAll()
    {
        return await context.Tests.Include(i => i.Parts).Include(i=>i.GroupTests).ToListAsync();
    }

    public async Task<Test> GetById(int id, bool includeParts = false)
    {
        if (includeParts)
        {
            return await context.Tests.Include(i => i.Parts).Include(i=>i.GroupTests).FirstOrDefaultAsync(i => i.Id == id);
        }
        else
        {
            return await context.Tests.FirstOrDefaultAsync(i => i.Id == id);
        }
    }
    
    public async Task<IEnumerable<Test>> GetByUserId(int id)
    {
        var user = await context.Users.FirstAsync(f => f.Id == id);
        var tests = await context.Tests.Include(i => i.GroupTests).ToListAsync();
        var foruser = tests.Where(i => i.GroupTests.Any(a=>a.GroupId==user.GroupId)).ToList();
        return foruser;
    }   

    public async Task<Test> AddTest(Test test)
    {
        context.Add(test);
        await context.SaveChangesAsync();
        return test;
    }

    public async Task UpdateTest(Test model)
    {
        var existingTest = await context.Tests.Include(i => i.Parts).Include(i=>i.GroupTests).FirstOrDefaultAsync(i => i.Id == model.Id);
        if (existingTest != null)
        {
            context.Entry(existingTest).CurrentValues.SetValues(model);
            foreach (var existingPart in existingTest.Parts)
            {
                if (!model.Parts.Any(i => i.Id == existingPart.Id))
                    context.TestParts.Remove(existingPart);
            }

            foreach (var modelPart in model.Parts)
            {
                var existingPart = existingTest.Parts.FirstOrDefault(f => f.Id == modelPart.Id && f.Id != default(int));

                if (existingPart is not null)
                {
                    context.Entry(existingPart).CurrentValues.SetValues(modelPart);
                }
                else
                {
                    existingTest.Parts.Add(modelPart);
                    context.Entry(modelPart).CurrentValues.SetValues(modelPart);
                }
            }

            var gtList = await context.GroupsTests.Where(g => g.TestId == model.Id).ToListAsync();
            foreach (var gt in model.GroupTests)
            {
                if (!gtList.Any(a => a.GroupId == gt.GroupId))
                {
                    gt.TestId = model.Id;
                    context.GroupsTests.Add(gt);
                }
            }
            foreach (var gt in gtList)
            {
                if (!model.GroupTests.Any(a => a.GroupId == gt.GroupId))
                {
                    context.GroupsTests.Remove(gt);
                }
            }
            
            await context.SaveChangesAsync();
        }
        else
        {
            throw new Exception($"Test with id {model.Id} not found");
        }
    }

    public async Task DeleteTest(int id)
    {
        var existingTest = await context.Tests.FirstOrDefaultAsync(i => i.Id == id);
        if (existingTest is not null)
        {
            context.Remove(existingTest);
            await context.SaveChangesAsync();
        }
        else
        {
            throw new Exception($"Test with id {id} not found");
        }
    }
}