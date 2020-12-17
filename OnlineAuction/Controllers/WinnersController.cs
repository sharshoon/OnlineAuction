using System;
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
        private readonly ILotService lotService;
        public WinnersController(ILotService lotService)
        {
            this.lotService = lotService;
        }
        public IEnumerable<object> GetWinners()
        {
            return this.lotService.GetWinners();
        }
    }
}
