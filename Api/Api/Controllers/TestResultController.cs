using System.Security.Claims;
using Api.Repositories;
using Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]

public class TestResultController(TestResultRepository repository) : Controller
{
    [Authorize(Roles = "Administrator, Editor, User")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> UserResults([FromRoute] int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (User.Claims.First(f => f.Type == "role").Value == "User")
        {
            var userid = ClaimUtils.GetClaimAsInt(User.Claims, "userid");
            return Json(await repository.GetForUser(userid).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync());
        }
        else
        {
            
            return Json(await repository.GetForUser(id).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync());
        }
    }
}