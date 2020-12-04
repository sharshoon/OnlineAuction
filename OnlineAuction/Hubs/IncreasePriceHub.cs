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
        private readonly RunningLots _runningLots;
        private readonly IUserManagementService _userManagementService;
        public IncreasePriceHub(RunningLots lots, IUserManagementService userManagementService)
        {
            _runningLots = lots;
            _userManagementService = userManagementService;
        }

        public async Task IncreasePrice(int lotId, int price, int percentage)
        {
            var message = new IncreasePriceMessage();

            // Receives the user's email in order to know who placed the bid
            var emailClaim = Context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim != null)
            {
                var user = await _userManagementService.GetUserByEmailAsync(emailClaim.Value);
                var role = await _userManagementService.GetRolesAsync(user);
                var isUser = role.Contains("user");

                // Attempts to extract the desired lot from the list.
                // If unsuccessful, it turns out that the lot is not running or it is not at all on the server
                if (_runningLots.Lots.TryGetValue(lotId, out var runningLot) && isUser)
                {
                    // We need to create a clone of the object in order to compare it with the old version and replace it in the list later.
                    var updatedLot = (RunningLot)runningLot.Clone();
                    message.LotId = lotId;

                    // Initially updatedLot.ActualPrice is set to 0, so the first time the price value is found
                    // it will not match "price" parameter and must be compared with updatedLot.Lot.MinPriceUsd
                    if (updatedLot.ActualPrice == price || updatedLot.Lot.MinPriceUsd == price)
                    {
                        if (updatedLot.ActualPrice == 0)
                        {
                            updatedLot.ActualPrice = updatedLot.Lot.MinPriceUsd;
                        }
                        updatedLot.ActualPrice += price * percentage / 100;
                        updatedLot.Leader = user;
                        message.Successed = true;
                        message.Message = "Price has been successfully updated";
                    }
                    else
                    {
                        message.Successed = false;
                        message.Message = "Lot price is out of date, please try again";
                    }

                    message.PriceUsd = updatedLot.ActualPrice;
                    if (!_runningLots.Lots.TryUpdate(lotId, updatedLot, runningLot))
                    {
                        message.Successed = false;
                        message.Message = "Information is out of date please try again";
                    }
                }
                else
                {
                    message.Successed = false;
                    message.Message = "Lot is not started!";
                }
            }
            else
            {
                message.Successed = false;
                message.Message = "Unknown user";
            }

            var response = JsonConvert.SerializeObject(message, JsonConverterSettings.ConverterSettings);
            await this.Clients.All.SendAsync("PriceUpdate", response);
        }
    }
}
