using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction.Engine;
using OnlineAuction.Models;
using Org.BouncyCastle.Asn1;

namespace OnlineAuction.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;
        public UsersController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }
        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponse>> GetUser(string userId)
        {
            var result = await _userManagementService.GetUsersInfoAsync(userId);
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest();
        }
    }
}
