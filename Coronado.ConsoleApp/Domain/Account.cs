using System;

namespace Coronado.ConsoleApp.Domain
{
    public class Account : IHasAlias {
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
    }
}
