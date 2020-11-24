using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineAuction.Models
{
    public class LotResponse : Lot
    {
        public bool IsSold { get; set; } = false;
        public string OwnerName { get; set; }
        public int PriceUsd { get; set; }
        public bool IsActive { get; set; } = false;
    }
}
