using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;

namespace OnlineAuction.Engine
{
    public static class FileHelper
    {
        private const int BytesPerMegabyte = 1048576;
        public static async Task<byte[]> ProcessStreamedFile(
            MultipartSection section, ContentDispositionHeaderValue contentDisposition,
            ModelStateDictionary modelState, string[] permittedExtensions, long sizeLimit)
        {
            try
            {
                using var memoryStream = new MemoryStream();
                await section.Body.CopyToAsync(memoryStream);

                if (memoryStream.Length == 0)
                {
                    modelState.AddModelError("File", "The file is empty.");
                }
                else if (memoryStream.Length > sizeLimit)
                {
                    // For a more understandable error, it is better to convert bytes to megabytes
                    var megabyteSizeLimit = sizeLimit / BytesPerMegabyte;
                    modelState.AddModelError("File", $"The file exceeds {megabyteSizeLimit:N1} MB.");
                }
                else if (!IsValidFileExtension(contentDisposition.FileName.Value, memoryStream, permittedExtensions))
                {
                    modelState.AddModelError("File", "The file type isn't permitted");
                }
                else
                {
                    return memoryStream.ToArray();
                }
            }
            catch (Exception ex)
            {
                modelState.AddModelError("File", $"The upload failed. Please contact the Help Desk for support. Error: {ex.HResult}");
            }

            return new byte[0];
        }
        private static bool IsValidFileExtension(string fileName, Stream data, IEnumerable<string> permittedExtensions)
        {
            if (string.IsNullOrEmpty(fileName) || data == null || data.Length == 0)
            {
                return false;
            }

            // Get file extension to check
            var ext = Path.GetExtension(fileName);
            ext = ext.Substring(1, ext.Length - 1).ToLowerInvariant();

            return !string.IsNullOrEmpty(ext) && permittedExtensions.Contains(ext);
        }
    }
}
