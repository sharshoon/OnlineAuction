using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class LotsInitializer
    {
        public static async Task InitializeLotsAsync(IServiceProvider services)
        {
            var repository = services.GetRequiredService<IAuctionRepository>();
            var webPath = services.GetRequiredService<IConfiguration>().GetConnectionString("ServerUrl");
            var imageName = "default-image.jpg";
            if (!repository.Lots.Any())
            {
                var defaultLot = new Lot()
                {
                    Name = "Default",
                    ImagePath = $"{webPath}/api/images/{imageName}",
                    Description = "This is test default lot!",
                    MinPriceUsd = "50",
                    ActionTimeSec = 100
                };

                await repository.AddNewLotAsync(defaultLot);
            }
        }
    }
}
