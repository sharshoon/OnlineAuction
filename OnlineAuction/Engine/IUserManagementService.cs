using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public interface IUserManagementService
    {
        Task<string> GetUserRoleAsync(string userId, bool returnName);
        Task<string> GetUserRoleAsync(string email);
        Task<ApplicationUser> FindUserAsync(string userId);
        Task<IdentityResult> AddUserAsync(ApplicationUser user, string password, string role);
        Task<IdentityResult> UpdateUserAsync(ApplicationUser user, string newUserRole, byte[] rowVersion);
        Task<IdentityResult> DeleteUserAsync(string userId);
        Task<IdentityResult> ChangePasswordAsync(ApplicationUser user, string password);

        Task<ApplicationUser> GetUserAsync(ClaimsPrincipal claimsPrincipal);
        Task<ApplicationUser> GetUserAsync(string userId);
        Task<ApplicationUser> GetUserByEmailAsync(string email);
        Task<IList<string>> GetRolesAsync(ApplicationUser user);
    }
}
