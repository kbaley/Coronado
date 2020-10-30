// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using Xunit;
using Coronado.Web.Domain;

namespace Coronado.Web.Tests
{
    public class FinancialCalculationTests {

        [Theory]
        [InlineData(
            new[] { -500.00, -1000.00, 1680 },
            new[] {0.0, 365.0, 365.0 * 2},
            0.088061
        )]
        [InlineData(
            new[] { -1000.00, 1100 },
            new[] {0.0, 365.0},
            0.1
        )]
        [InlineData(
            new[] { -500.0, -500.0, 1100 },
            new[] {0.0, 0.0, 365.0},
            0.1
        )]
        [InlineData(
            new[] { -500.0, -500.0, 500.0, 600.0 },
            new[] {0.0, 0.0, 365.0, 365.0},
            0.1
        )]
        // Fails with the initial IRR guess of 0.1
        [InlineData(
            new[] { -8442, -1688.346, 9481.2 },
            new[] {0.0, 0.0, 16.0},
            -0.77926
        )]
        public void ShouldCalculateIRR(double[] payments, double[] days, double expectedIrr) {

            var irr = Irr.CalculateIrr(payments, days);
            Assert.Equal(expectedIrr, irr, 5);
        }
    }
}
