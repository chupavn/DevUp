using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

// ReSharper disable once CheckNamespace
namespace DevUp.Data
{
    public static class Roles
    {
        private const string UserIdClaim = "quiz:cid";
        public const string Administrator = nameof(Administrator);
        public const string User = nameof(User);

        public static string UserName(this ClaimsPrincipal principal)
        {
            return principal.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }

        public static string UserId(this ClaimsPrincipal principal)
        {
            return principal.Claims.FirstOrDefault(x => x.Type == UserIdClaim)?.Value;
        }

        public static bool IsAdministrator(this ClaimsPrincipal principal)
        {
            return principal.IsInRole(Administrator);
        }

        public static bool IsUser(this ClaimsPrincipal principal)
        {
            return principal.IsInRole(User);
        }
    }
}
