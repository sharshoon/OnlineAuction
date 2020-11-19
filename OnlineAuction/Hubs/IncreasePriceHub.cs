using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Hubs
{
    public class IncreasePriceHub : Hub
    {
        private readonly RunningLots _runningLots;
        public IncreasePriceHub(RunningLots lots)
        {
            _runningLots = lots;
        }
        public async Task IncreasePrice(int lotId, int price, int percentage)
        {
            var message = new IncreasePriceMessage();
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

            var response = JsonConvert.SerializeObject(message, JsonConverterSettings.ConverterSettings);
            await this.Clients.All.SendAsync("PriceUpdate", response);
        }


    }
}
