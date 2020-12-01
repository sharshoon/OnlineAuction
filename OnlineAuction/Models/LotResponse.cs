﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OnlineAuction.Models
{
    public class LotResponse : Lot
    {
        public string OwnerName { get; set; }
        public bool IsActive { get; set; } = false;
    }
}
