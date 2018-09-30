using System;
using System.Collections.Generic;
using Coronado.Web.Domain;

public class AccountWithTransactions
{
    public string Name { get; set; }
    public Guid AccountId { get; set; }
    public IEnumerable<AccountTransaction> Transactions { get; set; }

    public class AccountTransaction {
        public Guid TransactionId { get; set; }
        public string Vendor { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public Guid? CategoryId { get; set; }
        public string CategoryName { get; set; }

        public static AccountTransaction FromTransaction(Transaction t) {
            return new AccountTransaction {
                TransactionId = t.TransactionId,
                Vendor = t.Vendor,
                Description = t.Description,
                TransactionDate = t.Date,
                CategoryId = (t.Category != null ? t.Category.CategoryId : Guid.Empty),
                CategoryName = (t.Category != null ? t.Category.Name : "")
            };
        }
    }
}
