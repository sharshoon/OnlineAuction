using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
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
            if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
            {
                return BadRequest();
            }

            var lot = new Lot();
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

            if (string.IsNullOrEmpty(lot.ImagePath.Trim()))
            {
                lot.ImagePath = $"{_imagesPath}/{DefaultImage}";
            }
            await this._repository.AddNewLotAsync(lot);

            return Created("api/lots", lot);
        }

        [Authorize(Policy = "IsAdmin")]
        [HttpDelete]
        public async Task<ActionResult<Lot>> DeleteLotAsync()
        {
            using var reader = new StreamReader(Request.Body);
            var body = await reader.ReadToEndAsync();

            var lot = JsonConvert.DeserializeObject<Lot>(body, JsonConverterSettings.ConverterSettings);

            var result = lot != null && await this._repository.TryDeleteLotAsync(lot.Id);
            if (result)
            {
                return Ok(lot);
            }

            return BadRequest(lot);
        }
    }
}
