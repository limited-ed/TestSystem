using System.Security.Claims;
using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController(GroupRepository repository) : Controller
    {
        [HttpGet]
        [Authorize(Roles = "Administrator, Editor")]
        public async Task<IActionResult> GetAll()
        {
            if (User.HasClaim(c => c.Type == "userId") &&
                Int32.TryParse(User.Claims.FirstOrDefault(f => f.Type == "userId")?.Value, out var id))
            {
                var groupId=Int32.Parse(User.Claims.First(f => f.Type == "groupId").Value);
                var result = groupId == 1 ? await repository.GetAllAsync() : await repository.GetGroupsForUser(id );
                return Json(result);
            }

            return NotFound();
        }
    }
}