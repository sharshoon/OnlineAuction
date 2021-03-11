using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public interface IEmailService
    {
        Task SendEmailToWinnerAsync(string email, string name, Lot lot, int price);
    }
}
