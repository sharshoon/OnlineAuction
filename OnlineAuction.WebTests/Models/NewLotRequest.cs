using System;
using System.Collections.Generic;
using System.Text;

namespace OnlineAuction.WebTests.Models
{
    class NewLotRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int MinPrice { get; set; }
        public int Duration { get; set; }

    }
}
