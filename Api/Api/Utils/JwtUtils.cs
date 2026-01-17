using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;

namespace Api.Authorization;

using Api.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


public class JWTKey
{
    public string ValidAudience { get; set; }
    public string ValidIssuer { get; set; }
    public string TokenExpiryTimeInHour { get; set; }
    public string PrivateKey { get; set; }
    public string PublicKey { get; set; }
    
    
}

public class JwtUtils
{
    private readonly JWTKey _jwtKey;

    public JwtUtils(IOptions<JWTKey> jwtKey)
    {
        _jwtKey = jwtKey.Value;
        if (string.IsNullOrEmpty(_jwtKey.PrivateKey) || string.IsNullOrEmpty(_jwtKey.PublicKey) )
            throw new Exception("JWT public or private key not configured");
    }

    public JwtUtils(JWTKey jwtKey)
    {
        _jwtKey = jwtKey;
        if (string.IsNullOrEmpty(_jwtKey.PrivateKey) || string.IsNullOrEmpty(_jwtKey.PublicKey) )
            throw new Exception("JWT public or private key not configured");
    }


    public (string token, string publicKey) GenerateJwtToken(User user)
    {
       
        var claims = new Dictionary<string, object>()
        {
            { ClaimTypes.Name, user.Login },
            { "fullName", user.Fullname },
            { "userId", user.Id },
            { "role", user.Role.ToString() },
            { "groupId", user.GroupId },
            { "group", user. Group.Title },

            
        };

        return GenerateJwtToken(claims);
    }

    public (string token, string publicKey) GenerateJwtToken(Dictionary<string, object> claims)
    {
        var identity = new ClaimsIdentity();
        foreach (var claim in claims)
        {
            identity.AddClaim(new Claim(claim.Key, claim.Value.ToString()));
        }

        return GenerateJwtToken(identity, DateTime.UtcNow.AddDays(1));
    }
    
    public (string token, string publicKey) GenerateJwtToken(Dictionary<string, object> claims, DateTime expires)
    {
        var identity = new ClaimsIdentity();
        foreach (var claim in claims)
        {
            identity.AddClaim(new Claim(claim.Key, claim.Value.ToString()));
        }

        return GenerateJwtToken(identity, expires);
    }

    public (string token, string publicKey) GenerateJwtToken(ClaimsIdentity identity, DateTime expires)
    {
        // generate token that is valid for 7 days
        var tokenHandler = new JwtSecurityTokenHandler();
        var rsa = RSA.Create(1024);
        var privateKey=File.ReadAllText(_jwtKey.PrivateKey);
        rsa.ImportFromPem(privateKey);

        var claims = identity.Claims.ToDictionary(t => t.Type, v => v.Value as object);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = identity,
            Audience = _jwtKey.ValidAudience,
            Issuer = _jwtKey.ValidIssuer,
            Expires = expires,
            SigningCredentials =
                new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256),
            Claims = claims
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return (tokenHandler.WriteToken(token), _jwtKey.PublicKey);
    }


    public int ValidateJwtToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtKey.PrivateKey!);
        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

            // return user id from JWT token if validation successful
            return userId;
        }
        catch
        {
            // return null if validation fails
            return -1;
        }
    }
}