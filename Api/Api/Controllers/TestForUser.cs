using Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TestForUser(TestRepository repository):Controller()
{
    [HttpGet]
    public async Task<IActionResult> GetForUser(int id)
    {
        try
        {
            var userId = Utils.ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            return Json(await repository.GetByUserId(userId));
        }
        catch (Exception)
        {
            return BadRequest();
        }

    }
}