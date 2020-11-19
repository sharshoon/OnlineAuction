using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineAuction.Models
{
    public class IncreasePriceMessage
    {
        public int LotId { get; set; }
        public bool Successed { get; set; }
        public string Message { get; set; }
        public int PriceUsd { get; set; }
    }
}
