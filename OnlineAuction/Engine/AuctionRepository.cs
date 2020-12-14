using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using OnlineAuction.Data;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class AuctionRepository : IAuctionRepository
    {
        private static string _imageDir;
        public AuctionRepository(ApplicationDbContext context, IUserManagementService userManagementService, IHostEnvironment env)
        {
            AuctionRepository._imageDir = $"{env.ContentRootPath}\\images";
            this._context = context;
            this.userManagementService = userManagementService;
        }

        private readonly ApplicationDbContext _context;
        private readonly IUserManagementService userManagementService;
        public IQueryable<Lot> Lots => this._context.Lots;
        public IQueryable<Winner> Winners => this._context.Winners;

        public async Task<Lot> AddNewLotAsync(Lot lot)
        {
            var result = await this._context.Lots.AddAsync(lot);
            await this._context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<Lot> TryDeleteLotAsync(int id, string defaultImageName)
        {
            var lot = await this._context.Lots.FirstOrDefaultAsync(lot => lot.Id == id);
            if (lot == null)
            {
                return null;
            }

            var imagePath = $"{_imageDir}\\{lot.ImagePath.Split("/")[^1]}";
            var result = this._context.Lots.Remove(lot);

            // After the lot is removed from the database, we also need to delete the picture associated with it
            if (File.Exists(imagePath) && imagePath != $"{_imageDir}\\{defaultImageName}")
            {
                File.Delete(imagePath);
            }
            await this._context.SaveChangesAsync();
            return result.Entity;
        }
        public async Task<Lot> UpdateLotAsync(Lot lot)
        {
            var result = this._context.Lots.Update(lot).Entity;
            await this._context.SaveChangesAsync();
            return result;
        }

        public async Task<Lot> GetLotAsync(int id)
        {
            return await this._context.Lots.FirstOrDefaultAsync(lot => lot.Id == id);
        }

        public async Task<string> GetWinnerNameAsync(int lotId)
        {
            Winner soldLot;
            try
            {
                soldLot = this._context.Winners.FirstOrDefault(lot => lot.Id == lotId);
            }
            catch
            {
                soldLot = null;
            }
            
            if (soldLot != null)
            {
                var user = await this.userManagementService.GetUserAsync(lotId.ToString());
                return user?.FullName;
            }

            return null;
        }

        public async Task<Winner> AddWinnerAsync(Winner winner)
        {
            var result = await this._context.Winners.AddAsync(winner);
            await this._context.SaveChangesAsync();
            return result.Entity;
        }

        public IQueryable<LotResponse> GetLotResponses()
        {
            var result = (from lot in this._context.Lots
                join soldLot in this._context.Winners on lot.Id equals soldLot.Id into soldLots
                from m in soldLots.DefaultIfEmpty()
                select new LotResponse
                {
                    Id = lot.Id,
                    Name = lot.Name,
                    Description = lot.Description,
                    NextLotId = lot.NextLotId,
                    MinPriceUsd = lot.MinPriceUsd,
                    ActionTimeSec = lot.ActionTimeSec,
                    ImagePath = lot.ImagePath,
                    IsSold = lot.IsSold
                });
            return result;
        }

        public IQueryable<LotResponse> GetLotResponses(int page, int pageSize, bool showSold, bool showUnsold)
        {
            var result = (from lot in this._context.Lots.Skip((page - 1) * pageSize).Where(lot => (lot.IsSold == showSold || !lot.IsSold == showUnsold) && (showSold || showUnsold)).Take(pageSize)
                join soldLot in this._context.Winners on lot.Id equals soldLot.Id into soldLots
                from m in soldLots.DefaultIfEmpty()
                select new LotResponse
                {
                    Id = lot.Id,
                    Name = lot.Name,
                    Description = lot.Description,
                    NextLotId = lot.NextLotId,
                    MinPriceUsd = lot.MinPriceUsd,
                    ActionTimeSec = lot.ActionTimeSec,
                    ImagePath = lot.ImagePath,
                    IsSold = lot.IsSold
                });
            return result;
        }

        public LotResponse GetLotResponse(int id)
        {
            var lotResponse = (from lot in this._context.Lots
                where lot.Id == id
                join soldLot in this._context.Winners on lot.Id equals soldLot.Id into soldLots
                from m in soldLots.DefaultIfEmpty()
                select new LotResponse
                {
                    Id = lot.Id,
                    Name = lot.Name,
                    Description = lot.Description,
                    NextLotId = lot.NextLotId,
                    MinPriceUsd = lot.MinPriceUsd,
                    ActionTimeSec = lot.ActionTimeSec,
                    ImagePath = lot.ImagePath,
                    //OwnerName = m.OwnerName,
                    IsSold = lot.IsSold
                });

            return lotResponse.FirstOrDefault();
        }

        public IQueryable<object> GetWinners()
        {
              var result = from winner in this._context.Winners
                    join user in this.userManagementService.Users on winner.UserId equals user.Id into users
                    from m in users.DefaultIfEmpty()
                    select new
                    {
                        winner.PriceUsd,
                        winner.Id,
                        winner.LotName,
                        winner.UserId,
                        OwnerName = m != null ? m.FullName : "-"
                    };

                return result;
            }

        public async Task<Lot> SetNextLotId(int lotId, int previousLotId)
        {
            var lot = this._context.Lots.FirstOrDefault(currentLot => currentLot.Id == lotId);
            var previousLot = this._context.Lots.FirstOrDefault(currentLot => currentLot.Id == previousLotId);
            if (lot != null && previousLot != null && previousLot.NextLotId == null && !previousLot.IsSold && lotId != previousLotId)
            {
                previousLot.NextLotId = lot.Id;
                var result = this._context.Lots.Update(lot);
                await this._context.SaveChangesAsync();
                return result.Entity;
            }

            return null;
        }
    }
}
