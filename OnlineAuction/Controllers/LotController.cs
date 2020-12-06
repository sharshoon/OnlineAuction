using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
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
        private const long FileSizeLimit = 52428800;
        private readonly string _imageFolder;
        private readonly string _imagesPath;
        private const string DefaultImage = "default-image.jpg";

        private readonly string[] _permittedExtensions =
        {
            "jpg",
            "png",
            "jpeg"
        };
        public LotController(IAuctionRepository repository, IHostEnvironment environment, IConfiguration configuration)
        {
            this._repository = repository;
            _imageFolder = $"{environment.ContentRootPath}/images";
            _imagesPath = $"{configuration.GetConnectionString("ServerUrl")}/api/images";
        }

        private readonly IAuctionRepository _repository;

        [HttpGet]
        public IEnumerable<LotResponse> GetLots()
        {
            var result = this._repository.GetLotResponses();
            return result;
        }

        [HttpGet("{id}")]
        public LotResponse GetLot(int id)
        {
            return this._repository.GetLotResponse(id);
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

            var lot = new Lot();

            // get bondary which separates sections in the request body
            var boundary = MultipartRequestHelper.GetBoundary(MediaTypeHeaderValue.Parse(Request.ContentType), new FormOptions().MultipartBoundaryLengthLimit);
            var reader = new MultipartReader(boundary, HttpContext.Request.Body);
            var section = await reader.ReadNextSectionAsync();

            while (section != null)
            {
                var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition);

                if (hasContentDispositionHeader)
                {
                    if (contentDisposition.IsFileDisposition())
                    {
                        // For each file, you need to come up with a name under which it will be stored,
                        // so that there is no error loading files with the same names
                        var fileName = Path.GetRandomFileName() + contentDisposition.FileName.Value;
                        var streamedFileContent = await FileHelper.ProcessStreamedFile(section, contentDisposition, ModelState, _permittedExtensions, FileSizeLimit);

                        if (!ModelState.IsValid)
                        {
                            return BadRequest(ModelState);
                        }

                        await using var targetStream = System.IO.File.Create($"{_imageFolder}/{fileName}");
                        await targetStream.WriteAsync(streamedFileContent);
                        lot.ImagePath = $"{_imagesPath}/{fileName}";
                    }
                    else if (contentDisposition.IsFormDisposition())
                    {
                        var content = await new StreamReader(section.Body).ReadToEndAsync();
                        if (contentDisposition.Name == "name")
                        {
                            lot.Name = content;
                        }
                        if (contentDisposition.Name == "description")
                        {
                            lot.Description = content;
                        }
                        if (contentDisposition.Name == "minPrice" && int.TryParse(content, out var minPrice))
                        {
                            lot.MinPriceUsd = minPrice;
                        }
                        if (contentDisposition.Name == "duration" && int.TryParse(content, out var duration))
                        {
                            lot.ActionTimeSec = duration;
                        }
                    }

                }
                section = await reader.ReadNextSectionAsync();
            }

            // If the user has not added pictures to the lot, then set the default picture
            if (string.IsNullOrEmpty(lot.ImagePath?.Trim()))
            {
                lot.ImagePath = $"{_imagesPath}/{DefaultImage}";
            }
            await this._repository.AddNewLotAsync(lot);

            return Created("api/lots", lot);
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Lot>> DeleteLotAsync(int id)
        {
            var result = await this._repository.TryDeleteLotAsync(id, DefaultImage);
            if (result)
            {
                return Ok("Lot was successfully deleted");
            }

            return BadRequest("This lot was not found on the server!");
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpPatch]
        public async Task<ActionResult<Lot>> SetNextLotId()
        {
            using var reader = new StreamReader(Request.Body);
            var body = reader.ReadToEndAsync().Result;

            var patch = JsonConvert.DeserializeObject<NexLotPatch>(body, JsonConverterSettings.ConverterSettings);
            if (patch != null)
            {
                var result = await this._repository.SetNextLotId(patch.LotId, patch.PreviousLotId);
                if (result != null)
                {
                    return Ok(result);
                }
            }

            return BadRequest();
        }
    }
}
