using System.Security.Claims;
using Api.Authorization;
using Api.Models;
using Api.Models.Auth;

namespace Api.Test.JwtTest;

public class JWTTest
{
    [Fact]
    public void GenerateJWT()
    {
        var user = new User()
        {
            Login = "admin", Id = 1, Role = UserRole.Administrator, Fullname = "Admin", Group = new Group() { Id = 1, Title = "1" },
            GroupId = 1
        };

        var privateKey = System.IO.File.ReadAllText("private.pem");

        var options = new JWTKey()
            { PrivateKey = privateKey, TokenExpiryTimeInHour = "24", ValidAudience = "1", ValidIssuer = "1" };
        
        var jwt = new JwtUtils(options);

        var token = jwt.GenerateJwtToken(user);

        
        Assert.NotEmpty(token);
    }
}