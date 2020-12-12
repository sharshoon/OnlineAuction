using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using OnlineAuction.Exceptions;
using OnlineAuction.Models;
using Org.BouncyCastle.Asn1.Ocsp;

namespace OnlineAuction.Engine
{
    public class LotService : ILotService
    {
        private readonly string[] _permittedExtensions =
        {
            "jpg",
            "png",
            "jpeg"
        };
        private const long FileSizeLimit = 52428800;
        private const string DefaultImage = "default-image.jpg";
        private readonly IAuctionRepository _repository;
        private readonly string _imageFolder;
        private readonly string _imagesPath;
        public LotService(IAuctionRepository repository, IHostEnvironment environment, IConfiguration configuration)
        {
            this._repository = repository;
            _imageFolder = $"{environment.ContentRootPath}/images";
            _imagesPath = $"{configuration.GetConnectionString("ServerUrl")}/api/images";
        }
        public IEnumerable<LotResponse> GetLots()
        {
            return this._repository.GetLotResponses();
        }

        public LotResponse GetLot(int id)
        {
            return this._repository.GetLotResponse(id);
        }

        public async Task<Lot> AddLotAsync(Stream bodyStream, StringSegment contentType, ModelStateDictionary modelState)
        {
            var lot = new Lot();

            // get bondary which separates sections in the request body
            var boundary = MultipartRequestHelper.GetBoundary(MediaTypeHeaderValue.Parse(contentType), new FormOptions().MultipartBoundaryLengthLimit);
            var reader = new MultipartReader(boundary, bodyStream);
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
                        var streamedFileContent = await FileHelper.ProcessStreamedFile(section, contentDisposition, modelState, _permittedExtensions, FileSizeLimit);

                        if (!modelState.IsValid)
                        {
                            throw new InvalidNewLotDataException("bad data", modelState);
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
            return await this._repository.AddNewLotAsync(lot);
        }

        public async Task<Lot> DeleteLotAsync(int id)
        {
            return await this._repository.TryDeleteLotAsync(id, DefaultImage);
        }

        public async Task<Lot> SetNextLotId(Stream stream)
        {
            using var reader = new StreamReader(stream);
            var body = reader.ReadToEndAsync().Result;

            var patch = JsonConvert.DeserializeObject<NexLotPatch>(body, JsonConverterSettings.ConverterSettings);
            if (patch != null)
            {
                var result = await this._repository.SetNextLotId(patch.LotId, patch.PreviousLotId);
                if (result != null)
                {
                    return result;
                }
            }

            return null;
        }
    }
}
