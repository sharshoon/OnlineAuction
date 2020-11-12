using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class LotsInitializer
    {
        public static async Task InitializeLotsAsync(IServiceProvider services)
        {
            var repository = services.GetRequiredService<IAuctionRepository>();
            if (!repository.Lots.Any())
            {
                var defaultLot = new Lot()
                {
                    Name = "Default",
                    Description = "This is test default lot!",
                    MinPriceUsd = "50",
                    ActionTimeSec = 100
                };

                await repository.AddNewLotAsync(defaultLot);
            }
        }
    }
}
