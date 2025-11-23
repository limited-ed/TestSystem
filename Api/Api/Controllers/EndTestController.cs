using Api.Models;
using Api.Repositories;
using Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Test")]
public class EndTestController(TestResultRepository repository) : Controller
{
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Post(int id, TestResult result)
    {
        var testResultId = ClaimUtils.GetClaimAsInt(User.Claims, "testResultId");

        var testResult = repository.GetById(id);
        if (id != testResultId && result.Id != testResultId && !result.Complete && result.Results.Count == 0)
        {
            return BadRequest();
        }

        var newResult = await repository.UpdateAndCheckAnswers(result);
        return Json(newResult);
    }
}