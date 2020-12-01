using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IIS.Core;

namespace OnlineAuction.Models
{
    public class RunningLot : ICloneable
    {
        public LotResponse Lot { get; set; }

        private int _actualPrice;
        public int ActualPrice
        {
            get => _actualPrice;
            set
            {
                _actualPrice = value; 
                this.LotTimer.SecondsLeft += 60;
            }
        }

        public LotTimer LotTimer { get; set; }
        public ApplicationUser Leader { get; set; }
        public object Clone()
        {
            return new RunningLot
            {
                Leader = this.Leader,
                _actualPrice = this._actualPrice,
                LotTimer = this.LotTimer,
                Lot = new LotResponse
                {
                    Id = this.Lot.Id,
                    Name = this.Lot.Name,
                    Description = this.Lot.Description,
                    ImagePath = this.Lot.ImagePath,
                    OwnerName = this.Lot.OwnerName,
                    IsSold = this.Lot.IsSold,
                    MinPriceUsd = this.Lot.MinPriceUsd,
                    ActionTimeSec = this.Lot.ActionTimeSec,
                    IsActive = this.Lot.IsActive,
                    NextLotId = this.Lot.NextLotId
                }
            };
        }
    }
}
