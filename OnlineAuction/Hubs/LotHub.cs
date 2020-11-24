using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
            var lotResponse = _repository.GetLotResponse(lotId);
            if (lotResponse != null && !_runningLots.Lots.ContainsKey(lotResponse.Id))
            {
                if (_runningLots.Lots.TryAdd(lotResponse.Id, lotResponse))
                {
                    await this.Clients.All.SendAsync("ActivateLot", message, lotId);

                    var startTime = DateTime.Now;
                    var endTime = startTime.AddSeconds(lotResponse.ActionTimeSec);

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

                    await this.Clients.All.SendAsync("Stop");

                    if (_runningLots.Lots.TryRemove(lotResponse.Id, out var removeResult))
                    {
                        var leader = _runningLots.Leader?.FullName ?? "-";
                        var winner = new Winner
                        {
                            Id = removeResult.Id,
                            UserId = _runningLots.Leader?.Id ?? "-",
                            OwnerName = _runningLots.Leader?.FullName ?? "-",
                            PriceUsd = removeResult.PriceUsd
                        };
                        await _repository.AddWinnerAsync(winner);
                        removeResult.IsSold = true;
                        await _repository.UpdateLotAsync(removeResult);
                    }
                }
            }
        }
    }
}
