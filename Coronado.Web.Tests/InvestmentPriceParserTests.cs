namespace Coronado.Web.Tests
{
    using System;
    using Xunit;
    using Moq;
    using Coronado.Web.Controllers.Api;
    using Coronado.Web.Domain;
    using System.Linq;
    using Microsoft.Extensions.Configuration;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Bogus;

    public class InvestmentPriceParserTests
    {

        [Fact]
        public void ShouldRun() {
            var symbol = "MOO";
            var start = (DateTime.Now - DateTime.UnixEpoch).TotalSeconds;
            var retriever = new Mock<IInvestmentRetriever>();
            var json = System.IO.File.ReadAllText("../../../moo.json");
            retriever.Setup(r => r.RetrieveDataFor(symbol, It.IsAny<double>()))
                .Returns(System.IO.File.ReadAllText("../../../moo.json"));
            var parser = new InvestmentPriceParser(retriever.Object);
            var investment = new Investment {
                InvestmentId = Guid.NewGuid(),
                Name = "MOO",
                Symbol = symbol
            };
            Assert.True(investment.HistoricalPrices.Count() == 0);
            parser.UpdatePriceHistoryFor(investment);
            Assert.True(investment.HistoricalPrices.Count() == 1);

        }

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
