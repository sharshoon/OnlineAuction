using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public class RunningLotService : IRunningLotService
    {
        private readonly IUserManagementService _userManagementService;
        private readonly RunningLots _runningLots;
        private readonly IAuctionRepository _auctionRepository;
        private readonly IEmailService _emailService;
        public RunningLotService(IUserManagementService userManagementService, RunningLots runningLots, IAuctionRepository auctionRepository, IEmailService emailService)
        {
            _userManagementService = userManagementService;
            this._runningLots = runningLots;
            _auctionRepository = auctionRepository;
            _emailService = emailService;
        }

        public async Task<IncreasePriceMessage> IncreasePrice(string email, int lotId, int price, int percentage)
        {
            var message = new IncreasePriceMessage();

            var user = await _userManagementService.GetUserByEmailAsync(email);
            var role = await _userManagementService.GetRolesAsync(user);
            var isUser = role.Contains("user");

            // Attempts to extract the desired lot from the list.
            // If unsuccessful, it turns out that the lot is not running or it is not at all on the server
            if (_runningLots.Lots.TryGetValue(lotId, out var runningLot) && isUser)
            {
                // We need to create a clone of the object in order to compare it with the old version and replace it in the list later.
                var updatedLot = (RunningLot)runningLot.Clone();
                message.LotId = lotId;

                // Initially updatedLot.ActualPrice is set to 0, so the first time the price value is found
                // it will not match "price" parameter and must be compared with updatedLot.Lot.MinPriceUsd
                if (updatedLot.ActualPrice == price || updatedLot.Lot.MinPriceUsd == price)
                {
                    if (updatedLot.ActualPrice == 0)
                    {
                        updatedLot.ActualPrice = updatedLot.Lot.MinPriceUsd;
                    }
                    updatedLot.ActualPrice += price * percentage / 100;
                    updatedLot.Leader = user;
                    message.Successed = true;
                    message.Message = "Price has been successfully updated";
                }
                else
                {
                    message.Successed = false;
                    message.Message = "Lot price is out of date, please try again";
                }

                message.PriceUsd = updatedLot.ActualPrice;
                if (!_runningLots.Lots.TryUpdate(lotId, updatedLot, runningLot))
                {
                    message.Successed = false;
                    message.Message = "Information is out of date please try again";
                }
            }
            else
            {
                message.Successed = false;
                message.Message = "Lot is not started!";
            }

            return message;
        }

        public async Task RemoveLot(int id)
        {
            if (_runningLots.Lots.TryRemove(id, out var removeResult))
            {
                // Preparing an entry in the table about the auction winners
                var winner = new Winner
                {
                    Id = removeResult.Lot.Id,
                    UserId = removeResult.Leader?.Id,
                    LotName = removeResult.Lot.Name,
                    PriceUsd = removeResult.ActualPrice
                };
                await _auctionRepository.AddWinnerAsync(winner);

                removeResult.Lot.IsSold = true;
                await _auctionRepository.UpdateLotAsync(removeResult.Lot);

                if (removeResult.Leader != null)
                {
                    await _emailService.SendEmailToWinnerAsync(removeResult.Leader?.Email,
                        removeResult.Leader?.FullName, removeResult.Lot, removeResult.ActualPrice);
                }
            }
        }
    }
}
