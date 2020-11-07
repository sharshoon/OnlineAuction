using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class RoleInitializer
    {
        public static async Task InitializeAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            var adminEmail = "admin@domain.com";
            var adminPassword = "admin";
            if (await roleManager.FindByNameAsync(Roles.Admin.ToString()) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Admin.ToString()));
            }
            if (await roleManager.FindByNameAsync(Roles.User.ToString()) == null)
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.User.ToString()));
            }
            if (await userManager.FindByNameAsync(adminEmail) == null)
            {
                ApplicationUser adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                };
                IdentityResult result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, Roles.Admin.ToString());
                }
            }
        }
    }
}
