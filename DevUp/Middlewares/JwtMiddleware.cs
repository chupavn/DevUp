using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using DevUp.Data;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevUp.Middleware
{
    //public class JwtMiddleware
    //{
    //    private readonly RequestDelegate _next;

    //    public JwtMiddleware(RequestDelegate next)
    //    {
    //        _next = next;
    //    }

    //    public async Task Invoke(HttpContext context, DataContext dataContext)
    //    {
    //        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
    //        if (token == null)
    //        {
    //            token = context.Request.Cookies["access_token"];
    //        }

    //        if (token != null)
    //            await attachAccountToContext(context, dataContext, token);

    //        await _next(context);
    //    }

    //    private async Task attachAccountToContext(HttpContext context, DataContext dataContext, string token)
    //    {
    //        try
    //        {
    //            var tokenHandler = new JwtSecurityTokenHandler();
    //            var key = Encoding.ASCII.GetBytes("this is my custom Secret key for authentication");
    //            tokenHandler.ValidateToken(token, new TokenValidationParameters
    //            {
    //                ValidateIssuerSigningKey = true,
    //                IssuerSigningKey = new SymmetricSecurityKey(key),
    //                ValidateIssuer = false,
    //                ValidateAudience = false,
    //                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
    //                ClockSkew = TimeSpan.Zero
    //            }, out SecurityToken validatedToken);

    //            var jwtToken = (JwtSecurityToken)validatedToken;
    //            int userId = int.Parse(validatedToken.Issuer);

    //            // attach account to context on successful jwt validation
    //            var user  = await dataContext.Users.FindAsync(userId);
    //            context.Items["User"] = user;
    //        }
    //        catch
    //        {
    //            // do nothing if jwt validation fails
    //            // account is not attached to context so request won't have access to secure routes
    //        }
    //    }
    //}
}