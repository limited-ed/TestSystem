using System.ComponentModel.DataAnnotations;
using Api.Authorization;
using Api.Models;
using Api.Models.Auth;
using Api.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace Api.Controllers;

public class UserModel
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
}

public class RefreshModel
{
    public string RefreshToken { get; set; }
}

[ApiController]
public class LoginController(JwtUtils jwtUtils, UserRepository userRepository) : Controller
{
    [HttpPost]
    [Route("/api/login")]
    public async Task<IActionResult> Token([FromBody] UserModel userModel)
    {
        var user = await userRepository.GetUserAsync(userModel.Username.ToLower(), MD5Utils.CreateMD5( userModel.Password));
        if (user != null)
        {
            var jwt = jwtUtils.GenerateJwtToken(user); 
            return Json(new AuthenticateResponse { Token = jwt.token, PublicKey = jwt.publicKey});
        }
        return Unauthorized();
    }
}

