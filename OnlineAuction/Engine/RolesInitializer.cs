using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class RolesInitializer
    {
        public static void InitializeRolesAsync(IServiceProvider services)
        {
            var umService = services.GetRequiredService<IUserManagementService>();

            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            foreach (var role in RoleHelpers.Roles)
            {
                if (!roleManager.RoleExistsAsync(role.Name).Result)
                {
                    var idRole = new IdentityRole(role.Name);
                    roleManager.CreateAsync(idRole).Wait();
                }
            }

            var adminUser = new ApplicationUser
            {
                UserName = "admin@domain.com",
                Email = "admin@domain.com",
                FirstName = "AdminFirst",
                LastName = "AdminLast",
                EmailConfirmed = true,
            };

            umService.AddUserAsync(adminUser, "admin", "admin").Wait();

            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            userManager.AddToRoleAsync(adminUser, "user").Wait();

            var user = new ApplicationUser
            {
                UserName = "user@domain.com",
                Email = "user@domain.com",
                FirstName = "FIRST",
                LastName = "LAST",
                EmailConfirmed = true
            };

            umService.AddUserAsync(user, "user", "user").Wait();
        }
    }
}
