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
    [Authorize(Roles = "Administrator,Editor")]
    public class CategoryController(CategoriesRepository repository) : Controller
    {
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
                return Json(await repository.GetForUser(userId));
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpGet("id")]
        public async Task<IActionResult> GetCategory(int id)
        {
            return Json(await repository.GetCategoryAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> PostCategory([FromBody] Category category)
        {
            try
            {
                var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
                var cat = await repository.AddCategory(category, userId);
                return Created(@"\api\categories", cat);
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory([FromQuery] int id, [FromBody] Category category)
        {
            try
            {
                var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
                
                return Ok(await repository.UpdateCategory(category,userId));
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [HttpDelete("id")]
        public async Task<IActionResult> DeleteCategory([FromQuery] int id)
        {
            try
            {
                var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
                await repository.DeleteCategory(id, userId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}