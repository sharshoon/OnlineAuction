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
            const string imageName = "default-image.jpg";
            if (!repository.Lots.Any())
            {
                var defaultLot = new Lot()
                {
                    Name = "Default",
                    ImagePath = $"{webPath}/api/images/{imageName}",
                    Description = "This is test default lot!",
                    MinPriceUsd = 50,
                    ActionTimeSec = 10
                };
                await repository.AddNewLotAsync(defaultLot);

                var defaultLot2 = new Lot()
                {
                    Name = "Default2",
                    ImagePath = $"{webPath}/api/images/test.jpg",
                    Description = "This is second lot!",
                    MinPriceUsd = 100,
                    ActionTimeSec = 30
                };
                await repository.AddNewLotAsync(defaultLot2);

                var defaultLot3 = new Lot()
                {
                    Name = "Default3",
                    ImagePath = $"{webPath}/api/images/{imageName}",
                    Description = "This is third default lot!",
                    MinPriceUsd = 150,
                    ActionTimeSec = 15
                };
                await repository.AddNewLotAsync(defaultLot3);

                var defaultLot4 = new Lot()
                {
                    Name = "Default4",
                    ImagePath = $"{webPath}/api/images/test.jpg",
                    Description = "This is forth lot!",
                    MinPriceUsd = 200,
                    ActionTimeSec = 20
                };
                await repository.AddNewLotAsync(defaultLot4);
            }
        }
    }
}
