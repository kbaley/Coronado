using System.Collections.Generic;

namespace Coronado.ConsoleApp.Domain.Formatters
{
    public class TransactionFormatter : Formatter<Transaction> {
        public TransactionFormatter(IEnumerable<Transaction> transactions) {
            _formatters.Add(t => t.TransactionDate, new FormatOptions(transactions.MaxLength(t => t.TransactionDate), Alignment.LEFT, true, FormatString.SHORT_DATE));
            _formatters.Add(t => t.Vendor, new FormatOptions(transactions.MaxLength(t => t.Vendor), Alignment.LEFT, true, FormatString.STRING));
            _formatters.Add(t => t.CategoryDisplay, new FormatOptions(transactions.MaxLength(t => t.CategoryDisplay), Alignment.LEFT, true, FormatString.STRING));
            _formatters.Add(t => t.Amount, new FormatOptions(transactions.MaxLength(t => t.Amount), Alignment.RIGHT, true, FormatString.DECIMAL));
            _formatters.Add(t => t.RunningTotal, new FormatOptions(transactions.MaxLength(t => t.RunningTotal), Alignment.RIGHT, false, FormatString.DECIMAL));

        }
    }
}
