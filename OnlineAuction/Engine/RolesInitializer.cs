using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class RolesInitializer
    {
        public static async Task InitializeRolesAsync(IServiceProvider services)
        {
            var umService = services.GetRequiredService<IUserManagementService>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            foreach (var role in RoleHelpers.Roles)
            {
                if (!roleManager.RoleExistsAsync(role.Name).Result)
                {
                    var idRole = new IdentityRole(role.Name);
                    await roleManager.CreateAsync(idRole);
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

            await umService.AddUserAsync(adminUser, "admin", "admin");

            var user = new ApplicationUser
            {
                UserName = "user@domain.com",
                Email = "user@domain.com",
                FirstName = "FIRST",
                LastName = "LAST",
                EmailConfirmed = true
            };

            await umService.AddUserAsync(user, "user1", "user");
        }
    }
}
