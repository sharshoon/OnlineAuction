using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Primitives;
using OnlineAuction.Models;

namespace OnlineAuction.Engine
{
    public interface ILotService
    {
        IEnumerable<LotResponse> GetLots();
        LotResponse GetLot(int id);
        LotsResponse GetLotPage(int page);

        Task<Lot> AddLotAsync(Stream bodyStream, StringSegment contentType,
            ModelStateDictionary modelState);
        Task<Lot> TryDeleteLotAsync(int id);
        Task<Lot> SetNextLotId(Stream stream);
    }
}
