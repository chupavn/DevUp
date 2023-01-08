using AutoMapper;
using DevUp.Data;
using DevUp.Helpers;
using DevUp.Models;
using DevUp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace NetCorePosgreSql.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/auth")]
    public class AuthController: ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        // private readonly IConfiguration _configuration;
        private readonly DataContext _context;
        //private readonly IEmailSender _mailSender;
        private const string UserIdClaim = "quiz:cid";
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly IEmailService _emailService;

        public AuthController(IUserService userService, JwtService jwtService, IMapper mapper,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            DataContext context,
            IOptions<AppSettings> appSettings,
            IEmailService emailService
            )
        {
            _userService = userService;
            _jwtService = jwtService;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            //_configuration = configuration;
            _context = context;
            _appSettings = appSettings.Value;
            _emailService = emailService;
        }

        [Route("login")]
        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            try {
                var appUser = _userManager.Users.SingleOrDefault(r => !r.Deleted.HasValue && r.Email == model.Email);

                //await _userManager.AddToRoleAsync(appUser, Roles.Administrator);

                if (appUser == null)
                {
                    return StatusCode(401, new { message = "Incorrect username or password" });
                }

                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

                if (result.Succeeded)
                {
                    var accessToken = await GenerateJwtToken(model.Email, appUser);
                    Response.Cookies.Append("access_token", accessToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Expires = DateTime.UtcNow.AddDays(_appSettings.JwtExpireDays)
                    });
                    appUser.LastLoginTime = DateTime.UtcNow;
                    _context.SaveChanges();
                    return Ok(new { accessToken });
                }

                // return new JsonResult(new { message = "Incorrect username or password" }) { StatusCode = StatusCodes.Status401Unauthorized };
                return StatusCode(401, new { message = "Incorrect username or password" });
            }
            catch(Exception ex) {
                return Problem(ex.Message);
            };
            
        }

        [Route("logout")]
        [HttpPost()]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            Response.Cookies.Delete("access_token");

            return Ok("Sign-out confirmed");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    if (user == null || user.Deleted.HasValue)
                    {
                        // Don't reveal that the user does not exist or is not confirmed, don't be nice to bad guys..
                        return Ok();
                    }

                    // For more information on how to enable account confirmation and password reset please visit https://go.microsoft.com/fwlink/?LinkID=532713
                    // Send an email with this link
                    var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                    code = WebUtility.UrlEncode(code);
                    var callbackUrl = $"{_appSettings.SiteUrl}#/users/reset-password/{model.Email}/{code}";

                    _emailService.Send(model.Email, "Reset password", $"<p>Hi {user.Name}!</p><p>You have requested a new password for Dev Community. Click the link below to set your new password!</p><p><a href='{callbackUrl}'>Click here to reset your password</a></p><p>Best regards</p><p>Dev Team</p>");

                    //Logger.LogInformation("Password reset link sent to '{0}' ({1})", model.Email);
                }

                return Ok();
            }
            catch (Exception e)
            {
                throw;
            }
            
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return Unauthorized();
            }
            var code = WebUtility.UrlDecode(model.Code);
            var result = await _userManager.ResetPasswordAsync(user, code, model.Password);
            if (result.Succeeded)
            {
                return Ok();
            }

            return StatusCode(500, "Error resetting password");
        }

        private async Task<string> GenerateJwtToken(string email, ApplicationUser user)
        {
            var userData = _context.Users.FirstOrDefault(x => x.Id == user.Id && !x.Deleted.HasValue);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(UserIdClaim, user.Id.ToString())
            };

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach (var role in userRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddDays(Convert.ToDouble(_appSettings.JwtExpireDays));

            var token = new JwtSecurityToken(
                _appSettings.JwtIssuer,
                _appSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public class LoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class ForgotPasswordDto
        {
            public string Email { get; set; }
        }

        public class ResetPasswordDto
        {
            public string Email { get; set; }
            public string Code { get; set; }
            public string Password { get; set; }
        }

        //[HttpPost("register")]
        //public ActionResult<UserResponse> Register(UserRegisterDto userRegisterDto)
        //{
        //    var user = new ApplicationUser
        //    {
        //        Name = userRegisterDto.Name,
        //        Email = userRegisterDto.Email,
        //        PasswordHash = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password),
        //    };

        //    _userService.Create(user);

        //    return Ok(_mapper.Map<UserResponse>(user));
        //}

        //[HttpPost("login")]
        //public ActionResult Login(UserLoginDto userLoginDto)
        //{
        //    var user = _userService.GetUserByEmail(userLoginDto.Email);

        //    if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
        //    {
        //        return BadRequest("User or password is invalid");
        //    }

        //    var jwt = _jwtService.Generate(user.Id);

        //    var updateUserDto = _mapper.Map<UserUpdateDto>(user);
        //    updateUserDto.LastLogin = DateTime.UtcNow;

        //    _userService.Update(user.Id, updateUserDto);

        //    Response.Cookies.Append("access_token", jwt, new CookieOptions { 
        //        HttpOnly = true
        //    });

        //    return Ok(new { jwt });
        //}

        //[HttpPost("logout")]
        //public ActionResult LogOut()
        //{
        //    Response.Cookies.Delete("access_token");

        //    return Ok();
        //}
    }
}
