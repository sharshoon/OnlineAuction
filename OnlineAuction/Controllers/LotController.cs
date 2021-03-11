using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineAuction.Engine;
using OnlineAuction.Exceptions;
using OnlineAuction.Models;

namespace OnlineAuction.Controllers
{
    [Route("api/lots")]
    [ApiController]
    public class LotController : ControllerBase
    {
        public LotController(ILotService lotService)
        {
            _lotService = lotService;
        }

        private readonly ILotService _lotService;

        [HttpGet]
        public LotsResponse GetLots(int page = 1, bool showSold = true, bool showUnsold = false)
        {
            return _lotService.GetLotPage(page, showSold, showUnsold);
        }

        [HttpGet("{id}")]
        public ActionResult<LotResponse> GetLot(int id)
        {
            var result = this._lotService.GetLot(id);
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest();
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPost]
        public async Task<ActionResult<Lot>> AddLotAsync()
        {
            // if content is not multipart/form-data
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest();
            }

            try
            {
                var result = await _lotService.AddLotAsync(HttpContext.Request.Body, Request.ContentType, ModelState);
                return Created("api/lots", result);
            }
            catch (InvalidNewLotDataException exception)
            {
                return BadRequest(exception.ModelState);
            }
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteLotAsync(int id)
        {
            var result = await this._lotService.TryDeleteLotAsync(id);
            if (result != null)
            {
                return Ok("Lot was successfully deleted");
            }

            return BadRequest("This lot was not found on the server!");
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPatch]
        public async Task<ActionResult<Lot>> SetNextLotId()
        {
            var result = await _lotService.SetNextLotId(Request.Body);
            if (result != null)
            {
                return Ok(result);
            }

            return BadRequest();
        }
    }
}
