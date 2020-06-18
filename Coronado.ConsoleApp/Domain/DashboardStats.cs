namespace Coronado.ConsoleApp.Domain
{
    partial class Program
    {
        public class DashboardStats
        {
            public decimal NetWorth { get; set; }
            public decimal LiquidAssetsBalance { get; set; }
            public decimal CreditCardBalance { get; set; }
            public decimal NetWorthLastMonth { get; set; }
            public decimal NetWorthChange
            {
                get
                {
                    return NetWorth - NetWorthLastMonth;
                }
            }

        }
    }
}
