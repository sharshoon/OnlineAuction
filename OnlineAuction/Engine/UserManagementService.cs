﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Data;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
	public class UserManagementService : IUserManagementService
	{
		private readonly ApplicationDbContext _context;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IAuctionRepository _auctionRepository;

		public UserManagementService(ApplicationDbContext context, UserManager<ApplicationUser> userManager,
			RoleManager<IdentityRole> roleManager, IAuctionRepository auctionRepository)
		{
			_context = context;
			_userManager = userManager;
			_roleManager = roleManager;
            _auctionRepository = auctionRepository;
            Users = _userManager.Users;
		}

        public IQueryable<ApplicationUser> Users { get; }

        public async Task<string> GetUserRoleAsync(string userId, bool returnName)
		{
			var user = await _context.Users.AsNoTracking().Where(u => u.Id == userId).FirstOrDefaultAsync();
			var roles = await _userManager.GetRolesAsync(user);

			foreach (var rolePair in RoleHelpers.Roles)
			{
				var identityRole = await _context.Roles.AsNoTracking().Where(role => role.Name == rolePair.Name)
					.FirstOrDefaultAsync();
                if (identityRole != null && roles.Contains(identityRole.Name))
                {
                    return returnName ? rolePair.Name : rolePair.Description;
                }
            }
			return "";
		}
		public async Task<string> GetUserRoleAsync(string email)
		{
			var user = await _context.Users.AsNoTracking().Where(u => u.Email == email).FirstOrDefaultAsync();
			var roles = await _userManager.GetRolesAsync(user);

			foreach (var rolePair in RoleHelpers.Roles)
			{
				var identityRole = await _context.Roles.AsNoTracking().Where(role => role.Name == rolePair.Name).FirstOrDefaultAsync();
                if (roles.Contains(identityRole.Name))
                {
                    return rolePair.Name;
                }
            }
			return "";
		}
		public async Task<ApplicationUser> FindUserAsync(string userId)
		{
			var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);

			return user;
		}
		public async Task<IdentityResult> AddUserAsync(ApplicationUser user, string password, string role)
		{
            if (await _userManager.FindByEmailAsync(user.Email) != null)
				return IdentityResult.Failed(new IdentityError() { Description = "Email already in use!" });

			var result = await _userManager.CreateAsync(user, password);

			if (result.Succeeded)
				await _userManager.AddToRoleAsync(user, role);

			return result;
		}
		public async Task<IdentityResult> UpdateUserAsync(ApplicationUser user, string newUserRole, byte[] rowVersion)
		{
			var existingUser = await _userManager.FindByEmailAsync(user.Email);
			if (existingUser != null && existingUser.Id != user.Id)
				return IdentityResult.Failed(new IdentityError() { Description = "Email already in use!" });

			_context.Entry(user).State = EntityState.Modified;
			_context.Entry(user).Property("RowVersion").OriginalValue = rowVersion;

            await _context.SaveChangesAsync();

			var existingRoles = (await _userManager.GetRolesAsync(user)).ToArray();
			var result = await _userManager.RemoveFromRolesAsync(user, existingRoles);

			if (result.Succeeded)
				result = await _userManager.AddToRoleAsync(user, newUserRole);

			return result;
		}
		public async Task<IdentityResult> DeleteUserAsync(string userId)
		{
			var user = await _userManager.FindByIdAsync(userId);
			return await _userManager.DeleteAsync(user);
		}
		public async Task<IdentityResult> ChangePasswordAsync(ApplicationUser user, string password)
		{
			var result = await _userManager.RemovePasswordAsync(user);
			if (result.Succeeded)
				result = await _userManager.AddPasswordAsync(user, password);

			return result;
		}
		
		public async Task<ApplicationUser> GetUserAsync(ClaimsPrincipal claimsPrincipal)
		{
            return await _userManager.GetUserAsync(claimsPrincipal);
		}
        public async Task<ApplicationUser> GetUserAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }

        public async Task<ApplicationUser> GetUserByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }

        public async Task<IList<string>> GetRolesAsync(ApplicationUser user)
        {
            return await _userManager.GetRolesAsync(user);
        }

        public async Task<UserResponse> GetUsersInfoAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var lots = _auctionRepository.GetUserWonLots(userId);
                return new UserResponse
                {
					Id = user.Id,
					FirstName = user.FirstName,
					LastName = user.LastName,
					Email = user.Email,
					WinningLots = lots
                };
            }
			return null;
        }
	}
}
