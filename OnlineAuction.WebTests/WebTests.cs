using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using OnlineAuction.Engine;
using OnlineAuction.Models;
using OnlineAuction.WebTests.Models;
using Xunit;

namespace OnlineAuction.WebTests
{
    public class WebTests : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        public HttpClient Client { get; }

        public WebTests(CustomWebApplicationFactory<Startup> factory)
        {
            Client = factory.CreateClient();
        }

        [Fact]
        public async Task Index_Page_Test()
        {
            // Arrange & Act
            var response = await Client.GetAsync("/");
            response.EnsureSuccessStatusCode();
            var stringResponse = await response.Content.ReadAsStringAsync();

            // Assert
            Assert.Contains("OnlineAuction", stringResponse);
        }

        [Fact]
        public async Task Get_Lots_Test()
        {
            var response = await Client.GetAsync("/api/lots");
            response.EnsureSuccessStatusCode();
            var stringResponse = await response.Content.ReadAsStringAsync();
            var lotsResponse = JsonConvert.DeserializeObject<LotsResponse>(stringResponse, JsonConverterSettings.ConverterSettings);
            Assert.NotNull(lotsResponse?.Lots);
        }

        [Fact]
        public async Task Add_Lot_Test()
        {
            var content = new MultipartContent
            {
                new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("name", "test lot"),
                    new KeyValuePair<string, string>("description",
                        "TestTestTestTestTestTestTestTestTestTestTestTest"),
                    new KeyValuePair<string, string>("duration", "10"),
                    new KeyValuePair<string, string>("minPrice", "15"),
                })
            };

            var response = await Client.PostAsync("/api/lots", content);
            response.EnsureSuccessStatusCode();

            var stringResponse = await response.Content.ReadAsStringAsync();
            var lot = JsonConvert.DeserializeObject<Lot>(stringResponse, JsonConverterSettings.ConverterSettings);

            Assert.NotNull(lot);
        }
    }
}
