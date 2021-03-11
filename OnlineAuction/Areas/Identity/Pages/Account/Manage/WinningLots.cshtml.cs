using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Areas.Identity.Pages.Account.Manage
{
    public class WinningLotsModel : PageModel
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuctionRepository _repository;
        public List<Winner> Winners = new List<Winner>();

        public WinningLotsModel(UserManager<ApplicationUser> userManager, IAuctionRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
        }
        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user != null)
            {
                var winners = _repository.Winners.Where(winner => winner.UserId == user.Id);
                foreach (var winner in winners)
                {
                    Winners.Add(winner);
                }
            }
            return Page();
        }
    }
}
