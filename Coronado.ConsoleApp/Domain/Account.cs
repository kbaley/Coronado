using System;

namespace Coronado.ConsoleApp.Domain
{
    public class Account {
        public Guid AccountId { get; set; }
        public string Name { get; set; }
        public decimal StartingBalance { get; set; }
        public string Alias { get; set; }
        public string Currency { get; set; }
        public int DisplayOrder { get; set; }
        public string Vendor { get; set; }
        public string AccountType { get; set; }
        public bool IsHidden { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal CurrentBalanceInUsd { get; set; }

        public override string ToString() {
            return $"{Alias,4}  {Name.PadRight(25, '.')}{Math.Round(CurrentBalance, 2).ToString().PadLeft(10, '.')}";
        }
    }
}
