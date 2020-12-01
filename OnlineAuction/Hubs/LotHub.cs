﻿using System;
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
        private readonly RunningLots _runningLots;
        public LotHub(IAuctionRepository repository, RunningLots lots)
        {
            this._repository = repository;
            _runningLots = lots;
        }

        public async Task StartLot(string message, int lotId)
        {
            var lotResponse = _repository.GetLotResponse(lotId);
            if (lotResponse != null && !lotResponse.IsSold && !_runningLots.Lots.ContainsKey(lotResponse.Id))
            {
                var runningLot = new RunningLot
                {
                    LotTimer = new LotTimer(),
                    Lot = lotResponse,
                    ActualPrice = lotResponse.MinPriceUsd
                };

                if (_runningLots.Lots.TryAdd(lotResponse.Id, runningLot))
                {
                    await this.Clients.All.SendAsync("ActivateLot", message, lotId);

                    var startTime = DateTime.Now;
                    var endTime = startTime.AddSeconds(lotResponse.ActionTimeSec);

                    await Task.Factory.StartNew(() =>
                    {
                        runningLot.LotTimer.SecondsLeft = (int)Math.Round((endTime - startTime).TotalSeconds);
                        while (runningLot.LotTimer.SecondsLeft >= 0)
                        {
                            this.Clients.All.SendAsync("DecreaseTime", runningLot.LotTimer.SecondsLeft);
                            runningLot.LotTimer.SecondsLeft -= 1;
                            Thread.Sleep(1000);
                        }
                    });

                    await this.Clients.All.SendAsync("Stop");

                    if (_runningLots.Lots.TryRemove(lotResponse.Id, out var removeResult))
                    {
                        var winner = new Winner
                        {
                            Id = removeResult.Lot.Id,
                            UserId = removeResult.Leader?.Id ?? "-",
                            LotName = removeResult.Lot.Name,
                            OwnerName = removeResult.Leader?.FullName ?? "-",
                            PriceUsd = removeResult.ActualPrice
                        };
                        await _repository.AddWinnerAsync(winner);
                        
                        removeResult.Lot.IsSold = true;
                        await _repository.UpdateLotAsync(removeResult.Lot);
                    }
                }
            }
        }
    }
}
