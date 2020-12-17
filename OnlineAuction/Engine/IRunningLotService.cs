using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public interface IRunningLotService
    {
        Task<IncreasePriceMessage> IncreasePrice(string email, int lotId, int price, int percentage);
        Task RemoveLot(int id);
    }
}
