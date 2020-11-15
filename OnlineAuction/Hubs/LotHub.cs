using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.VisualBasic;
using OnlineAuction.Engine;

namespace OnlineAuction.Hubs
{
    public class LotHub : Hub
    {
        private readonly IAuctionRepository _repository;
        private int _duration;
        public LotHub(IAuctionRepository repository)
        {
            this._repository = repository;
        }
        public async Task StartLot(string message, int lotId)
        {
            var lot = await this._repository.GetLotAsync(lotId);
            if (lot != null)
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
}
