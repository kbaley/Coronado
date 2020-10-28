// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using Xunit;
using Coronado.Web.Controllers.Api;
using Moq;
using Coronado.Web.Data;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace Coronado.Web.Tests
{
    public class QifParserTests {
        
        [Fact]
        public void ShouldParseText() {

            var options = new DbContextOptionsBuilder<CoronadoDbContext>()
                .UseInMemoryDatabase(databaseName: "Coronado")
                .Options;
            var context = new CoronadoDbContext(options);
            var parser = new QifParser(context);
            var transactionText = File.ReadAllText("TransactionList.txt");
            var accountId = Guid.NewGuid();

            var transactions = parser.Parse(transactionText, accountId, null);

            Assert.Equal(9, transactions.Count());
            Assert.Equal(new DateTime(2020, 10, 27), transactions.First().TransactionDate);
            Assert.Equal(-199.22m, transactions.Last().Amount);
            Assert.Equal("WHEN I'M GONE", transactions.Last().Description);
            Assert.Equal(199.22m, transactions.Last().Debit);
        }

        [Fact]
        public void ShouldParseOfxFile() {
            
            var options = new DbContextOptionsBuilder<CoronadoDbContext>()
                .UseInMemoryDatabase(databaseName: "Coronado")
                .Options;
            var context = new CoronadoDbContext(options);
            var parser = new QifParser(context);
            var mockFile = new Mock<IFormFile>();
            var accountId = Guid.NewGuid();
            var stream = System.IO.File.OpenRead("Test.ofx");
            mockFile.Setup(x => x.OpenReadStream()).Returns(stream);
            mockFile.Setup(x => x.Length).Returns(stream.Length);

            var transactions = parser.Parse(mockFile.Object, accountId, null);

            Assert.Equal(10, transactions.Count());
            Assert.Equal(new DateTime(2020, 10, 25), transactions.First().TransactionDate);
            Assert.Equal(-50, transactions.Last().Amount);
            Assert.Equal("SALSA MAKING LESSONS", transactions.Last().Description);
            Assert.Equal("15732", transactions.Last().DownloadId);
        }

        [Fact]
        public void ShouldIgnorePreviousDatesForOfx() {
            
            var mockContext = new Mock<CoronadoDbContext>();
            var options = new DbContextOptionsBuilder<CoronadoDbContext>()
                .UseInMemoryDatabase(databaseName: "Coronado")
                .Options;
            var context = new CoronadoDbContext(options);
            var parser = new QifParser(context);
            var mockFile = new Mock<IFormFile>();
            var accountId = Guid.NewGuid();
            var stream = System.IO.File.OpenRead("Test.ofx");
            mockFile.Setup(x => x.OpenReadStream()).Returns(stream);
            mockFile.Setup(x => x.Length).Returns(stream.Length);

            var transactions = parser.Parse(mockFile.Object, accountId, new DateTime(2020, 10, 23));

            Assert.Equal(4, transactions.Count());
            Assert.Equal(new DateTime(2020, 10, 25), transactions.First().TransactionDate);
            Assert.Equal(-13.41m, transactions.Last().Amount);
            Assert.Equal("TOWER RECORDS", transactions.Last().Description);
            Assert.Equal("171780", transactions.Last().DownloadId);
        }



    }
}
