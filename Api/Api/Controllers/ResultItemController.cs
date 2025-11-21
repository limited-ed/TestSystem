using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;


[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "User")]
public class TestResultController(ResultItemsRepository repository): Controller
{

}