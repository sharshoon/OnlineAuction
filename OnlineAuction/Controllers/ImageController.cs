using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace OnlineAuction.Controllers
{
    [Route("api/images")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private static string _imageDir;
        public ImageController(IWebHostEnvironment env)
        {
            ImageController._imageDir = env.ContentRootPath + "\\images";
        }
        [HttpGet("{imageName}")]
        public IActionResult Get(string imageName)
        {
            var imagePath = $"{ImageController._imageDir}\\{imageName}";
            var image = System.IO.File.OpenRead(imagePath);
            var format = imageName.Split(".")[1];
            return File(image, $"image/{format}");
        }
    }
}
