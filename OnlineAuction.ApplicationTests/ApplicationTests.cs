using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Hosting;
using Moq;
using OnlineAuction.Controllers;
using OnlineAuction.Engine;
using OnlineAuction.Models;
using Xunit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Org.BouncyCastle.Asn1;

namespace OnlineAuction.ApplicationTests
{
    public class ApplicationTests
    {
        private const string Boundary = "----WebKitFormBoundary9WAgr9iiWc4l839";
        [Fact]
        public async Task Add_Lot_Test()
        {

            var repoMock = new Mock<IAuctionRepository>();
            repoMock.Setup(repo => repo.AddNewLotAsync(It.IsAny<Lot>())).ReturnsAsync(new Lot());
            var hostMock = new Mock<IHostEnvironment>();
            hostMock.Setup(host => host.ContentRootPath).Returns(AppDomain.CurrentDomain.BaseDirectory);

            var runningLots = new RunningLots();
            var lotService = new LotService(repoMock.Object, hostMock.Object, new Configuration(), runningLots, null);

            var form = new MultipartFormDataContent(Boundary)
            {
                {new StringContent("Lot"), "name"},
                {new StringContent("Hello, This is test lot from unit test!!!!!!!"), "description"},
                {new StringContent("50"), "minPrice"},
                {new StringContent("20"), "duration"}
            };

            await using var stream = await form.ReadAsStreamAsync();
            var result = await lotService.AddLotAsync(stream, $"multipart/form-data; boundary={Boundary}", new ModelStateDictionary());

            Assert.NotNull(result);
        }

        [Fact]
        public async Task Add_Invalid_Lot_Test()
        {
            var repoMock = new Mock<IAuctionRepository>();
            repoMock.Setup(repo => repo.AddNewLotAsync(It.IsAny<Lot>())).ReturnsAsync(new Lot());
            var hostMock = new Mock<IHostEnvironment>();
            hostMock.Setup(host => host.ContentRootPath).Returns(AppDomain.CurrentDomain.BaseDirectory);

            var runningLots = new RunningLots();
            var lotService = new LotService(repoMock.Object, hostMock.Object, new Configuration(), runningLots, null);

            var form = new MultipartFormDataContent(Boundary)
            {
                {new StringContent("Lot"), "name"},
                {new StringContent("Hello, short desc"), "description"}, // should be more then 20
                {new StringContent("-5"), "minPrice"}, // should be positive
                {new StringContent("0"), "duration"} // should be positive
            };

            await using var stream = await form.ReadAsStreamAsync();
            var result = await lotService.AddLotAsync(stream, $"multipart/form-data; boundary={Boundary}", new ModelStateDictionary());

            Assert.Null(result);
        }
    }
}
