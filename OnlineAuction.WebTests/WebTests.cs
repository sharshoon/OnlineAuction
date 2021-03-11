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
        public async Task Login_Page_Test()
        {
            // Arrange & Act
            var response = await Client.GetAsync("/Identity/Account/Login");
            response.EnsureSuccessStatusCode();
            var stringResponse = await response.Content.ReadAsStringAsync();

            // Assert
            Assert.Contains("Log in - Online Auction", stringResponse);
        }

        [Fact]
        public async Task Register_Page_Test()
        {
            // Arrange & Act
            var response = await Client.GetAsync("/Identity/Account/Register");
            response.EnsureSuccessStatusCode();
            var stringResponse = await response.Content.ReadAsStringAsync();

            // Assert
            Assert.Contains("Register - Online Auction", stringResponse);
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
        public async Task Get_Winners_Test()
        {
            var response = await Client.GetAsync("/api/winners");
            response.EnsureSuccessStatusCode();
            var stringResponse = await response.Content.ReadAsStringAsync();
            var lotsResponse = JsonConvert.DeserializeObject<List<object>>(stringResponse, JsonConverterSettings.ConverterSettings);
            Assert.NotNull(lotsResponse);
        }
    }
}
