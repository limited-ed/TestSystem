using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class QuestionRepository(DataContext context)
{
    public async Task<IEnumerable<Question>> GetAll()
    {
        return await context.Questions.Include(i => i.Answers).ToListAsync();
    }

    public async Task<Question> GetById(int id, bool includeAnswers = false)
    {
        Question question;
        if (includeAnswers)
        {
            question = await context.Questions.Include(i => i.Answers).FirstAsync(i => i.Id == id);
        }
        else
        {
            question = await context.Questions.FirstAsync(i => i.Id == id);
        }

        return question;
    }

    public async Task<Question> AddQuestion(Question question)
    {
        context.Add(question);
        await context.SaveChangesAsync();
        return question;
    }

    public async Task UpdateQuestion(Question model)
    {
        var existingQuestion = await context.Questions.Include(i => i.Answers).FirstOrDefaultAsync(i => i.Id == model.Id);
        if (existingQuestion != null)
        {
            context.Entry(existingQuestion).CurrentValues.SetValues(model);
            foreach (var existingAnswer in existingQuestion.Answers)
            {
                if(!model.Answers.Any(i => i.Id == existingAnswer.Id))
                    context.Answers.Remove(existingAnswer);
            }

            foreach (var modelAnswer in model.Answers)
            {
                var existingAnswer = existingQuestion.Answers.FirstOrDefault( f => f.Id == modelAnswer.Id && f.Id != default(int));

                if (existingAnswer is not null)
                {
                    context.Entry(existingAnswer).CurrentValues.SetValues(modelAnswer);
                }
                else
                {
                    existingQuestion.Answers.Add(modelAnswer);
                    context.Entry(modelAnswer).CurrentValues.SetValues(modelAnswer);
                }
            }
            await context.SaveChangesAsync();
        }
        else
        {
            throw new Exception($"Question with id {model.Id} not found");
        }
    }

    public async Task DeleteQuestion(int id)
    {
        var existingQuestion = await context.Questions.FirstOrDefaultAsync(i => i.Id == id);
        if (existingQuestion is not null)
        {
            context.Remove(existingQuestion);
            await context.SaveChangesAsync();
        }
        else
        {
            throw new Exception($"Question with id {id} not found");
        }
    }
}