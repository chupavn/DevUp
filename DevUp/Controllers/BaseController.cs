using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DevUp.Data;
using DevUp.Models;
using System.Linq;

namespace DevUp.Controllers
{
    [Controller]
    public abstract class BaseController : ControllerBase
    {
        // returns the current authenticated user (null if not logged in)
        public ApplicationUser CurrentUser => GetCurrentUser();
        protected readonly DataContext dbContext;

        protected bool EnableSoftDelete { get; set; } = true;

        protected BaseController(DataContext _dbContext)
        {
            dbContext = _dbContext;
        }

        protected string GetUsersName()
        {
            var userId = User.UserId();

            if (string.IsNullOrEmpty(userId)) return User.UserName();
            var user = dbContext.Users.FirstOrDefault(x => x.Id == userId);
            return user != null ? user.Name : User.UserName();
        }

        protected ApplicationUser GetCurrentUser()
        {
            var userId = User.UserId();

            if (string.IsNullOrEmpty(userId)) return null;
            var user = dbContext.Users.FirstOrDefault(x => x.Id == userId);
            return user ?? null;
        }
    }
}