using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineAuction.Models
{
    public class LotsResponse
    {
        public IEnumerable<LotResponse> Lots { get; set; }
        public int PagesCount { get; set; }
    }
}
