using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OnlineAuction.Data;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            InitializeRoles(host); 
            host.Run();
        }

        private static void InitializeRoles(IHost host)
        {
            using var serviceScope = host.Services.CreateScope();
            var services = serviceScope.ServiceProvider;

            var umService = services.GetRequiredService<IUserManagementService>();
            var usersCount = umService.GetAllUsersCountAsync("").Result;
            if (usersCount == 0)
            {
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

                foreach (RoleHelpers.RolePair role in RoleHelpers.Roles)
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
                    Approved = true
                };

                umService.AddUserAsync(adminUser, "admin", "admin").Wait();

                var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                userManager.AddToRoleAsync(adminUser, "user").Wait();

                var user = new ApplicationUser();

                user.UserName = "user@domain.com";
                user.Email = "user@domain.com";
                user.FirstName = "FIRST";
                user.LastName = "LAST";
                user.EmailConfirmed = true;
                user.Approved = true;
                umService.AddUserAsync(user, "user", "user").Wait();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
