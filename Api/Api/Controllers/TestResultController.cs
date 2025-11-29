using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Repositories;
using Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[Route("api/[controller]")]
[ApiController]

public class TestResultController(TestResultRepository repository) : Controller
{

    [Authorize(Roles = "Administrator, Editor")]
    [HttpGet()]
    public async Task<IActionResult> GetAll([FromQuery]string from, [FromQuery]string to)
    {
        if (String.IsNullOrEmpty(from) || String.IsNullOrEmpty(to))
        {
            return BadRequest("Range is not set");
        }

        var fromDate = DateTime.Parse(from, new CultureInfo("ru-RU")).ToUniversalTime();
        var toDate = DateTime.Parse(to,new CultureInfo("ru-RU")).AddDays(1).ToUniversalTime();
        
        var userid = ClaimUtils.GetClaimAsInt(User.Claims, "userId");
        var options = new JsonSerializerOptions()
        {
            TypeInfoResolver = new IgnoreFieldTypeInfoResolver([new(){Type = typeof(User), IgnoreFields = ["password"]}]),
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            WriteIndented = true
        };
        return Json(await repository.GetAll(userid, fromDate, toDate),options);
    }
    
    [Authorize(Roles = "Administrator, Editor, User")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> UserResults([FromRoute] int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (User.Claims.First(f => f.Type == ClaimTypes.Role).Value == "User")
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