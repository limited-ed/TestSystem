using System.Security.Claims;
using Api.Models;
using Api.Repositories;
using Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

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
            var groupId = Int32.Parse(User.Claims.First(f => f.Type == "groupId").Value);
            var result = groupId == 1 ? await repository.GetAllAsync() : await repository.GetGroupsForUser(id);
            return Json(result);
        }

        return NotFound();
    }

    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Post(Group group)
    {
        try
        {
            var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            group = await repository.AddGroup(group, userId);
            return Created("/api/groups", group);
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Put([FromRoute] int id, [FromBody] Group group)
    {
        try
        {
            var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            group = await repository.UpdateGroup(group, userId);
            return Json(group);
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var userId = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
            await repository.Delete(id, userId);
            return Ok();
        }
        catch (InvalidOperationException e)
        {
            return Conflict("Невозможно удалить группу, в которой есть пользователи или подгруппы");
        }
        catch (Exception e)
        {
            return BadRequest();
        }
    }
}