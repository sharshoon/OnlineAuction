using Microsoft.VisualStudio.TestTools.UnitTesting;
using OnlineAuction.Engine;
using OnlineAuction.Models;

namespace OnlineAuction.Tests
{
    [TestClass]
    public class RepositoryTests
    {
        private readonly IAuctionRepository _repository;
        private const string DefaultImage = "default-image.jpg";
        private int _addedLotId;
        public RepositoryTests(IAuctionRepository repository)
        {
            _repository = repository;
        }
        [TestMethod]
        public async void TryAddLot()
        {
            var lot = new Lot
            {
                Name = "Test lot",
                Description = "Description of the test lot. Description of the test lot",
                NextLotId = null,
                IsSold = false,
                ActionTimeSec = 10,
                MinPriceUsd = 50,
            };
            var result = await _repository.AddNewLotAsync(lot);
            if (result !=  null)
            {
                _addedLotId = result.Id;
            }
            Assert.IsNotNull(result);
        }

        [TestMethod]
        public async void TryDeleteLot()
        {
            var result = await _repository.TryDeleteLotAsync(_addedLotId, DefaultImage);
            Assert.IsNotNull(result);
        }
    }
}
