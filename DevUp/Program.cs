using DevUp.Data;
using DevUp.Helpers;
using DevUp.Models;
using DevUp.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();

builder.Services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.IgnoreNullValues = false);
builder.Services.AddControllers().AddNewtonsoftJson(o =>
{
    o.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var connectionString = builder.Configuration.GetConnectionString("SqlServerConnection");
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlServer(connectionString);
    //opt.UseNpgsql(connectionString);
    opt.EnableSensitiveDataLogging(true);
    //opt.UseSnakeCaseNamingConvention();
});

// configure strongly typed settings object
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IQuizService, QuizService>();
builder.Services.AddScoped<IQuizQuestionService, QuizQuestionService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddSingleton<IUploadService, UploadService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// add authentication
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.Password.RequiredUniqueChars = 2;

    // User settings.
    //options.User.AllowedUserNameCharacters =
    //    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@";
    options.User.RequireUniqueEmail = true;
})
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

// Add Jwt Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(cfg =>
{
        cfg.RequireHttpsMetadata = false;
    cfg.SaveToken = true;
        cfg.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration.GetSection("AppSettings").GetSection("JwtIssuer").Value,
            ValidAudience = builder.Configuration.GetSection("AppSettings").GetSection("JwtIssuer").Value,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings").GetSection("JwtKey").Value)),
            ClockSkew = TimeSpan.Zero // remove delay of token when expire
        };

        // We have to hook the OnMessageReceived event in order to
        // allow the JWT authentication handler to read the access
        // token from the query string when a WebSocket or 
        // Server-Sent Events request comes in.
        // https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-2.1
        cfg.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                if (string.IsNullOrEmpty(accessToken) || string.IsNullOrWhiteSpace(accessToken))
                {
                    accessToken = context.Request.Cookies["access_token"];
                }

                // If the request is for our hub...
                //var path = context.HttpContext.Request.Path;
                //if (!string.IsNullOrEmpty(accessToken) &&
                //    (path.StartsWithSegments("/signalr")))
                //{
                //    // Read the token out of the query string
                //    context.Token = accessToken;
                //}
                context.Token = accessToken;
                return Task.CompletedTask;
            }
        };
    });

// Register the Swagger services
//builder.Services.AddSwaggerDocument();

builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    var context = builder.Services.BuildServiceProvider()
                       .GetService<DataContext>();
    context.EnsureSeeded();

    app.UseDeveloperExceptionPage();
}

// Configure the HTTP request pipeline.
var options = new DefaultFilesOptions
{
    RequestPath = new PathString("/wwwroot/dist")
};
app.UseDefaultFiles(options);
app.UseFileServer(new FileServerOptions
{
    FileProvider = new CompositeFileProvider(app.Environment.WebRootFileProvider),

});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
                               Path.Combine(app.Environment.WebRootPath, "dist")),
    RequestPath = ""
});
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();
app.MapControllers();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToFile("/dist/index.html");
});
app.Run();
