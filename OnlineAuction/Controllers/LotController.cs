using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Controllers
{
    [Route("api/lots")]
    [ApiController]
    public class LotController : ControllerBase
    {
        public LotController(IAuctionRepository repository)
        {
            this._repository = repository;
        }

        private readonly IAuctionRepository _repository;

        [HttpGet]
        public IEnumerable<Lot> GetLots()
        {
            return _repository.Lots;
        }

        [HttpGet("{id}")]
        public async Task<Lot> GetLotAsync(int id)
        {
            return await this._repository.GetLotAsync(id);
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPost]
        public async Task<ActionResult<Lot>> AddLotAsync()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            var lot = JsonConvert.DeserializeObject<Lot>(body, ConverterSettings);

            var result = await this._repository.AddNewLotAsync(lot);
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest(lot);

        }

        [Authorize(Policy = "IsAdmin")]
        [HttpDelete]
        public async Task<ActionResult<Lot>> DeleteLotAsync()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            var lot = JsonConvert.DeserializeObject<Lot>(body, ConverterSettings);

            var result = lot != null && await this._repository.TryDeleteLotAsync(lot.Id);
            if (result)
            {
                return Ok(lot);
            }

            return BadRequest(lot);
        }

        private static readonly JsonSerializerSettings ConverterSettings = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new SnakeCaseNamingStrategy()
            },
            NullValueHandling = NullValueHandling.Ignore
        };
    }
}
