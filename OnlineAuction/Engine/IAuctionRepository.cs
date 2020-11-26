using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public interface IAuctionRepository
    {
        IQueryable<Lot> Lots { get; }
        IQueryable<Winner> Winners { get; }
        Task<Lot> AddNewLotAsync(Lot lot);
        Task<bool> TryDeleteLotAsync(int id, string defaultImagePath);
        Task<Lot> UpdateLotAsync(Lot lot);
        Task<Lot> GetLotAsync(int id);
        Task<string> GetWinnerNameAsync(int lotId);
        IQueryable<LotResponse> GetLotResponses();
        LotResponse GetLotResponse(int id);
        Task<Winner> AddWinnerAsync(Winner winner);
    }
}
