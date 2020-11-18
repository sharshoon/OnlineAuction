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
        private readonly RunningLots _runningLots;
        public LotHub(IAuctionRepository repository, RunningLots lots)
        {
            this._repository = repository;
            _runningLots = lots;
        }
        public async Task StartLot(string message, int lotId)
        {
            var lot = await this._repository.GetLotAsync(lotId);
            if (lot != null && !_runningLots.Lots.ContainsKey(lot.Id))
            {
                if (_runningLots.Lots.TryAdd(lot.Id, lot))
                {
                    await this.Clients.All.SendAsync("ActivateLot", message, lotId);

                    var startTime = DateTime.Now;
                    var endTime = startTime.AddSeconds(lot.ActionTimeSec);

                    await Task.Factory.StartNew(() =>
                    {
                        _duration = (int)Math.Round((endTime - startTime).TotalSeconds);
                        while (_duration >= 0)
                        {
                            this.Clients.All.SendAsync("DecreaseTime", _duration);
                            _duration--;
                            Thread.Sleep(1000);
                        }
                    });
                }
            }
        }
    }
}
