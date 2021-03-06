﻿using System;
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
        Task<Lot> TryDeleteLotAsync(int id, string defaultImagePath);
        Task<Lot> UpdateLotAsync(Lot lot);
        Task<Lot> GetLotAsync(int id);
        IQueryable<LotResponse> GetLotResponses();
        IQueryable<LotResponse> GetLotResponses(int page, int pageSize, bool showSold, bool showUnsold);
        LotResponse GetLotResponse(int id);
        Task<Winner> AddWinnerAsync(Winner winner);
        Task<Lot> SetNextLotId(int lotId, int previousLotId);
        public IEnumerable<Winner> GetUserWonLots(string userId);
    }
}
