using System;

namespace Coronado.ConsoleApp.Domain
{
    public class Vendor {
        public Guid VendorId {get; set; }
        public string Name { get; set; }
        public Guid LastTransactionCategoryId { get; set; }
    }
}
