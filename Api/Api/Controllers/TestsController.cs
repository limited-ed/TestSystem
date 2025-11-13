using Api.Repositories;
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
    }
}
