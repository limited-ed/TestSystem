using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class TestResultRepository(DataContext context)
{
    public async Task<TestResult> GetById(int id)
    {
        return await context.TestResults.FirstAsync(f => f.Id == id);
    }
    
    public IQueryable<TestResult> GetForUser(int userId)
    {
        return context.TestResults.Where(w => w.UserId == userId);
    }

    public async Task<TestResult> Add(TestResult testResult)
    {
        var a = context.TestResults.Add(testResult);
        await context.SaveChangesAsync();
        return testResult;
    }

    public async Task<TestResult> UpdateAndCheckAnswers(TestResult testResult)
    {
        var questionsId = testResult.Results.Select(s => s.QuestionId).ToList();
        var questions = await context.Questions.Include(i => i.Answers).Where(w => questionsId.Contains(w.Id))
            .ToListAsync();

        foreach (var resultItem in testResult.Results)
        {
            var q = questions.First(f => f.Id == resultItem.QuestionId);

            var isRight = true;
            var right = q.Answers.Where(w => w.IsRight);
            var wrong = q.Answers.Where(w => !w.IsRight);
            foreach (var answer in resultItem.Answers)
            {
                if (wrong.Any(a => a.Id == answer))
                {
                    isRight = false;
                }
            }

            foreach (var answer in right)
            {
                if (!resultItem.Answers.Any(a => a == answer.Id))
                {
                    isRight = false;
                }
            }


            resultItem.Right = isRight;
            context.ResultItems.Add(resultItem);
        }

        var old = await context.TestResults.FirstAsync(f => f.Id == testResult.Id);
        old.Complete = true;
        old.Right = testResult.Results.Count(w => w.Right);

        await context.SaveChangesAsync();
        
        return old;
    }
}