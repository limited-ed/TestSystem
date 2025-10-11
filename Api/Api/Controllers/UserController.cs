using Api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(UserRepository userRepository) : Controller
    {
        [HttpGet]
        [Authorize(Roles = "Administrator, Editor")]
        public async Task<IActionResult> GetAll()
        {
            var id = int.Parse(User.Claims.First(f => f.Type == "userId").Value);
            return Json(await userRepository.GetAllForUser(id));
        }

        [HttpGet("id")]
        [Authorize(Roles = "Administrator, Editor")]
        public async Task<User> GetUser(int id)
        {
            return await userRepository.GetUserAsync(id);
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PostUser(User user)
        {
            try
            {
                return Json(await userRepository.AddUserAsync(user));
            }
            catch (Exception e)
            {
                return UnprocessableEntity(e.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> PutUser([FromRoute]int id, [FromBody]User user)
        {
            if (await userRepository.GetUserAsync(id) == null)
            {
                return BadRequest();
            }
            try
            {
               return Ok(await userRepository.UpdateUserAsync(user));
            }
            catch (Exception e)
            {
                return UnprocessableEntity(e.Message);
            }
        }
    }
}