using Api.Data;
using Api.Models;

namespace Api.Repositories;

public class ResultItemsRepository(DataContext context)
{
    public async Task<ResultItem> Add(ResultItem item)
    {
        if (!context.ResultItems.Any(a => a.QuestionId == item.QuestionId && a.UserId == item.UserId))
        {
            context.ResultItems.Add(item);
            await context.SaveChangesAsync();
            return item;
        }
        else
        {
            throw (new ArgumentException("ResultItem already exists"));
        }
    }
}