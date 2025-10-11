using System.Security.Claims;

namespace Api.Utils;

public static class ClaimUtils
{
    public static int GetClaimAsInt(IEnumerable<Claim> claims, string name)
    {
        ArgumentNullException.ThrowIfNull(claims);
        ArgumentNullException.ThrowIfNull(name);
        var claim = claims.First(f => f.Type == name);
        return int.Parse(claim.Value);
    }
}