//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Filters;
//using NetCorePosgreSql.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;

//[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
//public class AuthorizeAttribute : Attribute, IAuthorizationFilter
//{
//    // private readonly IList<Role> _roles;

//    public AuthorizeAttribute()
//    {
//    }

//    public void OnAuthorization(AuthorizationFilterContext context)
//    {
//        var account = (ApplicationUser)context.HttpContext.Items["User"];
//        if (account == null)
//        {
//            // not logged in or role not authorized
//            context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
//        }
//        //else if (_roles.Any() && !_roles.Contains(account.Role))
//        //{
//        //    context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status403Forbidden };
//        //}
//    }
//}