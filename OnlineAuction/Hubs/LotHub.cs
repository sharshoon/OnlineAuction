using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
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
        private readonly ILotService _lotService;
        private readonly RunningLots _runningLots;
        private readonly IRunningLotService _runningLotService;
        public LotHub(RunningLots lots, IRunningLotService runningLotService, ILotService lotService)
        {
            _runningLots = lots;
            _runningLotService = runningLotService;
            _lotService = lotService;
        }

        public async Task StartLot(string message, int lotId)
        {
            int? nextLotId = lotId;
            do
            {
                var lotResponse = _lotService.GetLot((int)nextLotId);
                if (lotResponse != null && !lotResponse.IsSold && !_runningLots.Lots.ContainsKey(lotResponse.Id))
                {
                    var runningLot = new RunningLot
                    {
                        LotTimer = new LotTimer(),
                        Lot = lotResponse,
                        ActualPrice = lotResponse.MinPriceUsd
                    };

                    // Adding a lot to running lots
                    if (_runningLots.Lots.TryAdd(lotResponse.Id, runningLot))
                    {
                        // Notify subscribers that the lot has begun
                        await this.Clients.All.SendAsync("ActivateLot", message, runningLot.Lot.Id);

                        await Task.Factory.StartNew(() =>
                        {
                            runningLot.LotTimer.SecondsLeft = lotResponse.ActionTimeSec;
                            // Notify subscribers every second that the timer has changed
                            while (runningLot.LotTimer.SecondsLeft >= 0)
                            {
                                this.Clients.All.SendAsync("DecreaseTime", runningLot.LotTimer.SecondsLeft,
                                    runningLot.ActualPrice, runningLot.Lot.Id);
                                runningLot.LotTimer.SecondsLeft -= 1;
                                Thread.Sleep(1000);
                            }
                        });

                        await this.Clients.All.SendAsync("Stop", runningLot.Lot.Id);

                        await _runningLotService.RemoveLot(lotResponse.Id);
                    }
                }

                lotResponse = _lotService.GetLot((int)nextLotId);
                nextLotId = lotResponse.NextLotId;
            } while (nextLotId != null);
        }
    }
}
