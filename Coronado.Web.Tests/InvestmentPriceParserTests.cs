namespace Coronado.Web.Tests
{
    using System;
    using Xunit;
    using Moq;
    using Coronado.Web.Controllers.Api;
    using Coronado.Web.Data;
    using Coronado.Web.Domain;
    using System.Linq;

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
            var repo = new Mock<IInvestmentRepository>();
            var parser = new InvestmentPriceParser(repo.Object, retriever.Object);
            var investment = new Investment {
                InvestmentId = Guid.NewGuid(),
                Name = "MOO",
                Symbol = symbol
            };
            Assert.True(investment.HistoricalPrices.Count() == 0);
            parser.UpdatePriceHistoryFor(investment);
            Assert.True(investment.HistoricalPrices.Count() == 1);

        }
    }
}
