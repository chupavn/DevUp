using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DevUp.Models;

namespace DevUp.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public DataContext(DbContextOptions<DataContext> options): base(options)
        {
            //AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        //public DbSet<User> Users { set; get; }
        public DbSet<Quiz> Quizzes { set; get; }
        public DbSet<QuizQuestion> QuizQuestions { set; get; }

        public DbSet<Article> Articles { set; get; }
        public DbSet<ReadingList> ReadingLists { set; get; }
        public DbSet<UserLikeArticle> UserLikeArticles { set; get; }
        public DbSet<Tag> Tags { set; get; }
        public DbSet<UserTag> UserTags { set; get; }
        public DbSet<Comment> Comments { set; get; }
        public DbSet<UserLikeComment> UserLikeComments { set; get; }



        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //modelBuilder.Entity<ApplicationUser>(entity => {
            //    entity.HasIndex(e => e.Email).IsUnique();
            //});

            builder.Entity<Tag>(entity => {
                entity.HasIndex(e => e.Name).IsUnique();
            });

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.ToTable(name: "Users");
            });

            builder.Entity<IdentityRole>(entity =>
            {
                entity.ToTable(name: "Roles");
            });
            builder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.ToTable("UserRoles");
                //in case you chagned the TKey type
                //  entity.HasKey(key => new { key.UserId, key.RoleId });
            });

            builder.Entity<IdentityUserClaim<string>>(entity =>
            {
                entity.ToTable("UserClaims");
            });

            builder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.ToTable("UserLogins");
                //in case you chagned the TKey type
                //  entity.HasKey(key => new { key.ProviderKey, key.LoginProvider });       
            });

            builder.Entity<IdentityRoleClaim<string>>(entity =>
            {
                entity.ToTable("RoleClaims");

            });

            builder.Entity<IdentityUserToken<string>>(entity =>
            {
                entity.ToTable("UserTokens");
                //in case you chagned the TKey type
                // entity.HasKey(key => new { key.UserId, key.LoginProvider, key.Name });

            });
        }
    }

    public static class NotloggDbContextExtensions
    {
        public static void EnsureSeeded(this DataContext context)
        {
            // add default roles
            if (context.Roles.Count() < 2)
            {
                context.AddRole(Roles.Administrator);
                context.AddRole(Roles.User);
            }
        }

        private static void AddRole(this DataContext context, string name)
        {
            if (!context.Roles.Any(x => x.Name == name))
            {
                var role = new IdentityRole(name)
                {
                    Name = name,
                    NormalizedName = name.ToUpper()
                };

                context.Roles.Add(role);
                context.SaveChanges();
            }
        }
    }
}
