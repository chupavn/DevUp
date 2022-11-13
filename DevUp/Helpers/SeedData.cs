using Microsoft.AspNetCore.Identity;
using DevUp.Data;
using DevUp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DevUp.Helpers
{
    public static class SeedData
    {
        public static void Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            SeedRoles(roleManager);
            SeedUsers(userManager);
        }

        public static void SeedUsers(UserManager<ApplicationUser> userManager) 
        {
            if (userManager.FindByEmailAsync("admin@localhost").Result == null)
            {
                var user = new ApplicationUser
                {
                    Name = "admin",
                    UserName = "admin@localhost",
                    Email = "admin@localhost",
                };

                var result = userManager.CreateAsync(user, "12345678").Result;
                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, Roles.Administrator).Wait();
                }
            }
        }

        public static void SeedRoles(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.RoleExistsAsync(Roles.Administrator).Result)
            {
                var role = new IdentityRole
                {
                    Name = Roles.Administrator
                };

                var result = roleManager.CreateAsync(role);
            }

            if (!roleManager.RoleExistsAsync(Roles.User).Result)
            {
                var role = new IdentityRole
                {
                    Name = Roles.User
                };

                var result = roleManager.CreateAsync(role).Result;
            }
        }

    }
}
