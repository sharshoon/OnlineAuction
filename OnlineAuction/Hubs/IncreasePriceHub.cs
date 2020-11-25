using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Hubs
{
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
            var emailClaim = Context.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);
            if (emailClaim != null)
            {
                var user = await _userManagementService.GetUserByEmailAsync(emailClaim.Value);
                if (_runningLots.Lots.TryGetValue(lotId, out var lot))
                {
                    message.LotId = lotId;
                    if (lot.PriceUsd == price || lot.MinPriceUsd == price)
                    {
                        if (lot.PriceUsd == 0)
                        {
                            lot.PriceUsd = lot.MinPriceUsd;
                        }
                        lot.PriceUsd += price * percentage / 100;
                        message.Successed = true;
                        message.Message = "Price has been successfully updated";
                        _runningLots.Leader = user;
                    }
                    else
                    {
                        message.Successed = false;
                        message.Message = "Lot price is out of date, please try again";
                    }
                    message.PriceUsd = lot.PriceUsd;
                }
                else
                {
                    message.Successed = false;
                    message.Message = "Lot not found on server";
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
