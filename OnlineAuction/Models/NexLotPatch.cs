using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineAuction.Models
{
    public class NexLotPatch
    {
        public int LotId { get; set; }
        public int PreviousLotId { get; set; }
    }
}
