using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using OnlineAuction.Data;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class AuctionRepository : IAuctionRepository
    {
        public AuctionRepository(ApplicationDbContext context)
        {
            this._context = context;
        }

        private readonly ApplicationDbContext _context;
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
            var dbLot = await this._context.Lots.FirstOrDefaultAsync(l => l.Id == lot.Id);
            if (dbLot == null)
            {
                return null;
            }

            var result = this._context.Update(lot).Entity;
            await this._context.SaveChangesAsync();
            return result;
        }

        public async Task<Lot> GetLotAsync(int id)
        {
            return await this._context.Lots.FirstOrDefaultAsync(lot => lot.Id == id);
        }
    }
}
