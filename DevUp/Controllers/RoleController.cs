using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DevUp.Data;
using DevUp.Models;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Controllers
{
    [Authorize]
    [Route("api/roles")]
    public class RoleController : BaseController
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public RoleController(DataContext context, UserManager<ApplicationUser> userManager): base(context)
        {
            _userManager = userManager;
        }

        [HttpGet("")]
        public IActionResult GetAll()
        {
            return Ok(_dbContext.Roles.OrderBy(x => x.Name));
        }

        [Authorize(Roles = Roles.Administrator)]
        [HttpPost("add-user/{roleName}/{userId}")]
        public async Task<IActionResult> AddUser(string roleName, string userId)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);

            var result = await _userManager.AddToRoleAsync(user, roleName);

            if (result == IdentityResult.Success)
            {
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(Roles = Roles.Administrator)]
        [HttpDelete("remove/{roleName}/{userId}")]
        public async Task<IActionResult> RemoveUser(string roleName, string userId)
        {
            var user = _dbContext.Users.FirstOrDefault(x => x.Id == userId);

            var result = await _userManager.RemoveFromRoleAsync(user, roleName);

            if (result == IdentityResult.Success)
            {
                return Ok();
            }

            return BadRequest();
        }
    }
}
