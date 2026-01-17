namespace Api.Models.Auth;

public class AuthenticateResponse
{
    public string Token { get; set; }
    public string PublicKey { get; set; }
}