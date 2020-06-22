using System.Collections.Generic;

namespace Coronado.ConsoleApp.Domain.Formatters
{
    public class TransactionFormatter : Formatter<Transaction> {
        public TransactionFormatter(IEnumerable<Transaction> transactions) {
            Formatters.Add(t => t.TransactionDate, new FormatOptions(transactions.MaxLength(t => t.TransactionDate), Alignment.LEFT, true, FormatString.SHORT_DATE));
            Formatters.Add(t => t.Vendor, new FormatOptions(transactions.MaxLength(t => t.Vendor), Alignment.LEFT, true, FormatString.STRING));
            Formatters.Add(t => t.CategoryDisplay, new FormatOptions(transactions.MaxLength(t => t.CategoryDisplay), Alignment.LEFT, true, FormatString.STRING));
            Formatters.Add(t => t.Amount, new FormatOptions(transactions.MaxLength(t => t.Amount), Alignment.RIGHT, true, FormatString.DECIMAL));
            Formatters.Add(t => t.RunningTotal, new FormatOptions(transactions.MaxLength(t => t.RunningTotal), Alignment.RIGHT, false, FormatString.DECIMAL));

        }
    }
}
