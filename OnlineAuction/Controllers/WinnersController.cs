﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Controllers
{
    [Route("api/winners")]
    [ApiController]
    public class WinnersController : ControllerBase
    {
        private readonly IAuctionRepository _auctionRepository;
        public WinnersController(IAuctionRepository auctionRepository)
        {
            this._auctionRepository = auctionRepository;
        }
        public IEnumerable<object> GetWinners()
        {
            try
            {
                return _auctionRepository.GetWinners();
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
