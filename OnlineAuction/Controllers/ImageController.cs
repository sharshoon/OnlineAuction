using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace OnlineAuction.Controllers
{
    [Route("api/images")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private static string _imageDir;
        private static string _iconsDir;
        public ImageController(IHostEnvironment env)
        {
            ImageController._imageDir = $"{env.ContentRootPath}\\images";
            ImageController._iconsDir = $"{env.ContentRootPath}\\images\\icons";
        }
        [HttpGet("{imageName}")]
        public IActionResult Get(string imageName)
        {
            var imagePath = $"{ImageController._imageDir}\\{imageName}";
            //var image = System.IO.File.OpenRead(imagePath);
            //var format = imageName.Split(".")[1];
            //return File(image, $"image/{format}");
            return GetFile(imagePath, imageName);
        }

        [HttpGet("icons/{imageName}")]
        public IActionResult GetIcon(string imageName)
        {
            var imagePath = $"{ImageController._iconsDir}\\{imageName}";
            //var image = System.IO.File.OpenRead(imagePath);
            //var format = imageName.Split(".")[1];
            //return File(image, $"image/{format}");
            return GetFile(imagePath, imageName);
        }

        private IActionResult GetFile(string imagePath, string imageName)
        {
            var image = System.IO.File.OpenRead(imagePath);
            var format = imageName.Split(".")[1];
            return File(image, $"image/{format}");
        } 
    }
}
