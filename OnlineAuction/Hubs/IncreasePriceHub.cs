using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Hubs
{
    // This hub allows users with the "user" role to set a new price for a lot
    [Authorize]
    public class IncreasePriceHub : Hub
    {
        private readonly IRunningLotService _runningLotService;
        public IncreasePriceHub(IRunningLotService runningLotService)
        {
            this._runningLotService = runningLotService;
        }

        public async Task IncreasePrice(int lotId, int price, int percentage)
        {
            var message = new IncreasePriceMessage();

            // Receives the user's email in order to know who placed the bid
            var emailClaim = Context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim != null)
            {
                message = await _runningLotService.IncreasePrice(emailClaim.Value, lotId, price, percentage);
            }

            var response = JsonConvert.SerializeObject(message, JsonConverterSettings.ConverterSettings);
            await this.Clients.All.SendAsync("PriceUpdate", response);
        }
    }
}
