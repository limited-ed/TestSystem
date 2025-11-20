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
    public class TestController(TestRepository repository) : Controller
    {
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Json(await repository.GetAll());
        }

        
        [HttpPost]
        public async Task<IActionResult> Post(Test test)
        {
            if (test.Id != 0)
            {
                return BadRequest();
            }
            try
            {
                test.UserId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
                return Json(await repository.AddTest(test));
            }
            catch (Exception)
            {
                return BadRequest();
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, Test test)
        {
            if (id != test.Id || test.UserId != ClaimUtils.GetClaimAsInt(User.Claims, "userId"))
            {
                return BadRequest();
            }
            try
            {
                await repository.UpdateTest(test);
                return Json(test);
            }
            catch (Exception)
            {
                return BadRequest();
            }
            
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await repository.DeleteTest(id);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
