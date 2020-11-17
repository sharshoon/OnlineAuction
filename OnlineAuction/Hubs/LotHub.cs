using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using OnlineAuction.Controllers;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Hubs
{
    public class LotHub : Hub
    {
        private readonly IAuctionRepository _repository;
        private int _duration;
        private static readonly ConcurrentDictionary<int, Lot> RunningLots;
        public LotHub(IAuctionRepository repository)
        {
            this._repository = repository;
        }

        static LotHub()
        {
            RunningLots = new ConcurrentDictionary<int, Lot>();
        }
        public async Task StartLot(string message, int lotId)
        {
            var lot = await this._repository.GetLotAsync(lotId);
            if (lot != null && !RunningLots.ContainsKey(lot.Id))
            {
                if (RunningLots.TryAdd(lot.Id, lot))
                {
                    await this.Clients.All.SendAsync("ActivateLot", message, lotId);

                    var startTime = DateTime.Now;
                    var endTime = startTime.AddSeconds(lot.ActionTimeSec);

                    _duration = (int)Math.Round((endTime - startTime).TotalSeconds);
                    while (_duration >= 0)
                    {
                        this.Clients.All.SendAsync("DecreaseTime", _duration);
                        _duration--;
                        Thread.Sleep(1000);
                    }
                }
            }
        }

        public async Task IncreasePrice(int lotId, int price, int percentage)
        {
            var message = new IncreasePriceMessage();
            if (RunningLots.TryGetValue(lotId, out var lot))
            {
                if (lot.PriceUsd == price)
                {
                    lot.PriceUsd += price * percentage / 100;
                    message.Successed = true;
                    message.Message = "Price has been successfully updated";
                }
                else
                {
                    message.Successed = false;
                    message.Message = "Lot price is out of date, please try again";
                }
            }
            else
            {
                message.Successed = false;
                message.Message = "Lot not found on server";
            }
            
            var response = JsonConvert.SerializeObject(message);
            await this.Clients.All.SendAsync("PriceUpdate", response);
        }

    }
}
