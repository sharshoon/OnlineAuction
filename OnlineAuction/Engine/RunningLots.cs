using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class RunningLots
    {
        public readonly ConcurrentDictionary<int, LotResponse> Lots = new ConcurrentDictionary<int, LotResponse>();
        public ApplicationUser Leader { get; set; }
    }
}
