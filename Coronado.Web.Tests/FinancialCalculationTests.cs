// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using Xunit;
using Coronado.Web.Domain;

namespace Coronado.Web.Tests
{
    public class FinancialCalculationTests {

        [Fact]
        public void ShouldCalculateIRR() {
            var payments = new[] { -500.00, -1000.00, 1680};
            var days = new[] {0.0, 365.0, 365.0 * 2};
            var irr = Irr.CalculateIrr(payments, days);
            Assert.Equal(0.088061, irr, 5);
            payments = new[] { -1000.00, 1100};
            days = new[] {0.0, 365.0};
            irr = Irr.CalculateIrr(payments, days);
            Assert.Equal(0.1, irr);
            payments = new[] { -500.0, -500.0, 1100};
            days = new[] { 0.0, 0.0, 365.0};
            irr = Irr.CalculateIrr(payments, days);
            Assert.Equal(0.1, irr);
            payments = new[] { -500.0, -500.0, 500.0, 600.0};
            days = new[] { 0.0, 0.0, 365.0, 365.0};
            irr = Irr.CalculateIrr(payments, days);
            Assert.Equal(0.1, irr, 5);
        }
    }
}
