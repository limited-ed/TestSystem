using Api.Models;
using Api.Repositories;
using Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator, Editor")]
    public class QuestionController(QuestionRepository repository, CategoriesRepository categoriesRepository)
        : Controller
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Json(await repository.GetAll());
        }

        [HttpPost]
        public async Task<IActionResult> Post(Question question)
        {
            var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            var cats = await categoriesRepository.GetForUser(userId);
            try
            {
                if (question is not null && cats.Any(c => c.Id == question.CategoryId))
                {
                    var newQuestion = await repository.AddQuestion(question);
                    return Json(newQuestion);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("{id:int}")]
        public async Task<IActionResult> Post(int id, List<Question> questions)
        {
            var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            var cats = await categoriesRepository.GetForUser(userId);
            if (!cats.Any(a => a.Id == id))
            {
                return BadRequest();
            }

            try
            {
                var results = await repository.AddQuestion(questions, id);
                return Json(results);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, Question question)
        {
            var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            var cats = await categoriesRepository.GetForUser(userId);
            if (!cats.Any(a => a.Id == id) && question.Id != id)
            {
                return BadRequest();
            }

            try
            {
                await repository.UpdateQuestion(question);
                return Json(question);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
                var cats = await categoriesRepository.GetForUser(userId);
                var question = await repository.GetById(id);
                if (cats.Any(c => c.Id == question.CategoryId))
                {
                    await repository.DeleteQuestion(question.Id);
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}