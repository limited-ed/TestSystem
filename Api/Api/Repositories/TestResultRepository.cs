using Api.Data;
using Api.Models;

namespace Api.Repositories;

public class TestResultRepository(DataContext context)
{

    public async Task<TestResult> Add(TestResult testResult)
    {
        var a=context.TestResults.Add(testResult);
        await context.SaveChangesAsync();
        return testResult;
    }
    
}