using System.Collections.Generic;

namespace Coronado.ConsoleApp.Domain.Formatters
{
    public class AccountFormatter : Formatter<Account> {
        public AccountFormatter(IEnumerable<Account> accounts) {
            _formatters.Add(a => a.Name, new FormatOptions(accounts.MaxLength(a => a.Name), Alignment.LEFT, true, FormatString.STRING));
            _formatters.Add(a => a.CurrentBalance, new FormatOptions(accounts.MaxLength(a => a.CurrentBalance), Alignment.RIGHT, false, FormatString.DECIMAL));
        }
    }
}
