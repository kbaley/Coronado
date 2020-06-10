namespace Coronado.Web.Tests
{
    using System;
    using Xunit;
    using Moq;
    using Coronado.Web.Controllers.Api;
    using Coronado.Web.Domain;
    using System.Linq;
    using Microsoft.Extensions.Configuration;

    public class InvestmentPriceParserTests
    {

        [Fact(Skip = "Enable when you want to generate sample data")]
        public void ShouldLoadSampleQuoteData() {
            var config = new Mock<IConfiguration>();
            var configSection = new Mock<IConfigurationSection>();
            configSection.Setup(a => a.Value)
                .Returns("--enter key here--");
            config.Setup( c => c.GetSection("RapidApiKey")).Returns(configSection.Object);
            var retriever = new InvestmentRetriever(config.Object);
            var results = retriever.RetrieveTodaysPricesFor(new[] { "BND", "BNDX", "VOO", "AMZN", "MSFT", "CRM", "VXUS"})
                .GetAwaiter().GetResult();
            System.IO.File.WriteAllText(@"get-quotes-sample.json", results);
        }

    }
}
