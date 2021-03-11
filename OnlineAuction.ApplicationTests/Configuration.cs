using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Ini;
using Microsoft.Extensions.Primitives;

namespace OnlineAuction.ApplicationTests
{
    class Configuration : IConfiguration
    {
        private const string ServerUrl = "https://localhost:44390";
        public IConfigurationSection GetSection(string key)
        {
            return new ConfigurationSection(new ConfigurationRoot(new List<IConfigurationProvider>()), "hello");
        }

        public IEnumerable<IConfigurationSection> GetChildren()
        {
            throw new NotImplementedException();
        }

        public IChangeToken GetReloadToken()
        {
            throw new NotImplementedException();
        }

        public string this[string key]
        {
            get => throw new NotImplementedException();
            set => throw new NotImplementedException();
        }
    }
}
