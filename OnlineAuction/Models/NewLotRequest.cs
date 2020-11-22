using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineAuction.Models
{
    public class NewLotRequest
    {
        public string Image { get; set; }
        public string LotName { get; set; }
        public string Description { get; set; }
        public int MinPrice { get; set; }
        public int Duration { get; set; }
    }
}
