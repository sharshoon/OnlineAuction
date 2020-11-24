using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Data;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class AuctionRepository : IAuctionRepository
    {
        public AuctionRepository(ApplicationDbContext context, IUserManagementService userManagementService)
        {
            this._context = context;
            this.userManagementService = userManagementService;
        }

        private readonly ApplicationDbContext _context;
        private readonly IUserManagementService userManagementService;
        public IQueryable<Lot> Lots => this._context.Lots;
        public async Task<Lot> AddNewLotAsync(Lot lot)
        {
            var result = await this._context.Lots.AddAsync(lot);
            await this._context.SaveChangesAsync();
            return result.Entity;
        }

        public async Task<bool> TryDeleteLotAsync(int id)
        {
            var lot = await this._context.Lots.FirstOrDefaultAsync(lot => lot.Id == id);
            if (lot == null)
            {
                return false;
            }
            
            this._context.Lots.Remove(lot);
            await this._context.SaveChangesAsync();
            return true;

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
                    OwnerName = m.OwnerName,
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
                    OwnerName = m.OwnerName,
                    IsSold = lot.IsSold
                });

            return lotResponse.FirstOrDefault();
        }
    }
}
