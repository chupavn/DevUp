using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevUp.Data;
using DevUp.Dtos;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DevUp.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : BaseController
    {

        private readonly DataContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UserController(DataContext context, UserManager<ApplicationUser> userManager, IMapper mapper) : base(context)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(dbContext.Users.Where(x => !x.Deleted.HasValue).OrderBy(x => x.Name).Select(x =>
                    new UserData
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Email = x.Email,
                        PhoneNumber = x.PhoneNumber,
                        AvatarUrl = x.AvatarUrl,
                        Bio = x.Bio,
                    }));
        }

        [HttpGet("{userId}/roles")]
        public async Task<IActionResult> GetUserRoles(string userId)
        {
            var user = dbContext.Users.Where(x => !x.Deleted.HasValue).FirstOrDefault(x => x.Id == userId);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.GetRolesAsync(user);
            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        [Route("set-language/{language}")]
        public IActionResult SetLanguage(string language)
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var user = dbContext.Users.Where(x => !x.Deleted.HasValue).First(x => x.Email == userId);
            user.Language = language;
            dbContext.SaveChanges();

            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("current-user")]
        public async Task<IActionResult> GetLoggedinUser()
        {
            var userId = _userManager.GetUserId(HttpContext.User);
            var dbObjectUser = dbContext.Users.Where(x => !x.Deleted.HasValue).FirstOrDefault(x => x.Email == userId);

            if (dbObjectUser != null)
            {
                var user = new UserData
                {
                    Id = dbObjectUser.Id,
                    Name = dbObjectUser.Name,
                    Language = dbObjectUser.Language,
                    Email = dbObjectUser.Email,
                    PhoneNumber = dbObjectUser.PhoneNumber,
                    AvatarUrl = dbObjectUser.AvatarUrl
                };

                var userTags = _context.UserTags.Include(x => x.Tag).Where(x => x.UserId == CurrentUser.Id);
                var tags = userTags.Select(x => x.Tag).Distinct();
                user.Tags = _mapper.Map<List<TagResponseDto>>(tags);

                var roles = await _userManager.GetRolesAsync(dbObjectUser);
                user.Roles = roles.Select(x => x).ToList();


                return Ok(user);
            }


            return Unauthorized();
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get(string id)
        {
            return Ok(dbContext.Users.Select(x => new UserData
            {
                Id = x.Id,
                Name = x.Name,
                Language = x.Language,
                Email = x.Email,
                PhoneNumber = x.PhoneNumber,
                Bio = x.Bio,
                Location = x.Location,
                Education = x.Education,
                Work = x.Work,
                AvatarUrl = x.AvatarUrl,
                BirthDay = x.BirthDay,
            }).FirstOrDefault(x => x.Id == id));
        }

        [HttpGet]
        [Route("{userId}/profile")]
        public IActionResult GetUserProfile(string userId)
        {

            var user = dbContext.Users.FirstOrDefault(x => x.Id == userId);
            if (user != null)
            {
                var dto = _mapper.Map<UserProfileResponse>(user);
                dto.ArticleCount = _context.Articles.Count(x => x.AuthorId == userId && x.DeletedAt == null);
                dto.CommentCount = _context.Comments.Count(x => x.AuthorId == userId && x.DeletedAt == null);
                return Ok(dto);
            }

            return NotFound();
        }

        // [Authorize(Roles = Roles.Administrator)]
        [Route("")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Name = model.Name,
                Bio = model.Bio,
                Work = model.Work,
                Location = model.Location,
                Education = model.Education,
                RegistrationDate = DateTime.UtcNow

            };

            IdentityResult result = null;

            if (string.IsNullOrEmpty(model.Password))
            {
                // generate a random password if none is specified - the user
                // will need to use the forget password to reset it
                result = await _userManager.CreateAsync(user);
            }
            else
            {
                result = await _userManager.CreateAsync(user, model.Password);
            }

            if (result.Succeeded)
            {
                // we don't want to return the user object, just a subset of the properties
                return Ok(new UserData { Id = user.Id, Email = user.UserName, Name = user.Name });
            }

            return BadRequest(result.Errors);
        }

        // [Authorize(Roles = Roles.Administrator)]
        [Authorize]
        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, [FromBody] UserData userData)
        {
            var loggedUserEmail = _userManager.GetUserId(HttpContext.User);
            var user = dbContext.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            if (!(loggedUserEmail != null && loggedUserEmail == user.Email || Roles.IsAdministrator(HttpContext.User)))
            {
                return Unauthorized();
            }

            user.Name = userData.Name;
            user.Email = userData.Email;
            user.PhoneNumber = userData.PhoneNumber;
            user.UserName = userData.Email;
            user.NormalizedUserName = userData.Email;
            user.Bio = userData.Bio;
            user.Location = userData.Location;
            user.Education = userData.Education;
            user.Work = userData.Work;
            user.AvatarUrl = userData.AvatarUrl;
            user.BirthDay = userData.BirthDay;

            var result = await _userManager.UpdateAsync(user);

            if (result == IdentityResult.Success)
            {
                return Get(userId);
            }

            return BadRequest();
        }

        [Authorize(Roles = Roles.Administrator)]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> RemoveUser(string userId)
        {
            var user = dbContext.Users.FirstOrDefault(x => x.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            user.Deleted = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }

    public class UserData
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? Language { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Bio { get; set; }
        public string? Work { get; set; }
        public string? Location { get; set; }
        public string? Education { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime? BirthDay { get; set; }
        public List<TagResponseDto>? Tags { get; set; }
        public List<string>? Roles { get; set; }
    }

    public class RegisterUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string Password { get; set; }
        public string? Bio { get; set; }
        public string? Work { get; set; }
        public string? Location { get; set; }
        public string? Education { get; set; }
    }

}

