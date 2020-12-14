using System;
using System.Security.Claims;
using IdentityServer4.AspNetIdentity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Data;
using OnlineAuction.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using OnlineAuction.Engine;
using OnlineAuction.Hubs;

namespace OnlineAuction
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("Connection")));

            services.AddDefaultIdentity<ApplicationUser>(options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequiredLength = 5;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireDigit = false;
                })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>()
                .AddProfileService<ProfileService>();

            services.AddSignalR();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("IsAdmin", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, "admin");
                });
                options.AddPolicy("IsUser", policy =>
                {
                    policy.RequireClaim(ClaimTypes.Role, "user");
                });
            });

            services.AddScoped<IUserManagementService, UserManagementService>();
            services.AddScoped<IAuctionRepository, AuctionRepository>();
            services.AddSingleton<RunningLots>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ILotService, LotService>();
            services.AddControllersWithViews();
            services.AddRazorPages();
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime applicationLifetime)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapHub<LotHub>("/lot-hub");
                endpoints.MapHub<IncreasePriceHub>("/increase-price");
                if (env.IsProduction())
                {
                    endpoints.MapFallbackToController("Index", "Home");
                }
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}