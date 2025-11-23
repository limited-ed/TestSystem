using System.Runtime.InteropServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Authorization;
using Api.Models;
using Api.Repositories;
using Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User")]
public class StartTestController(TestRepository testRepository, QuestionRepository questionRepository, TestResultRepository testResultRepository ,JwtUtils jwtUtils):Controller()
{
    [HttpGet("{id:int}")]
    public async Task<IActionResult> StartTest(int id)
    {
        var test = await testRepository.GetById(id, true);

        var questions = new List<Question>();
        
        foreach (var part in test.Parts)
        {
           questions.AddRange(await questionRepository.GetByCategory(part.CategoryId, part.Count));
        }
      
        var span = CollectionsMarshal.AsSpan(questions);
        Random.Shared.Shuffle(span);
        
        var testResult = new TestResult()
        {
            TestId = id,
            UserId = ClaimUtils.GetClaimAsInt(User.Claims, "userId"),
            Complete = false,
            Total = questions.Count,
            DateTime = DateTime.UtcNow
        };

        testResult = await testResultRepository.Add(testResult);
        
        var claims = new Dictionary<string, object>()
        {
            { "testId", id },
            { "testResultId" , testResult.Id},
            { "role" , "Test"}
        };

        var token = jwtUtils.GenerateJwtToken(claims, DateTime.UtcNow.AddMinutes(test.Timer+1));

        var options = new JsonSerializerOptions()
        {
            TypeInfoResolver = new CustomTypeInfoResolver(),
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            WriteIndented = true
        };

        test.GroupTests = null;
        
        return Json(new { token = token, test=await testRepository.GetById(id), testResult = testResult, questions = questions }, options);
    }
}