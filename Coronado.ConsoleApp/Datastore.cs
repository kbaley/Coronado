namespace Coronado.ConsoleApp
{
    using System.Collections.Generic;
    using Coronado.ConsoleApp.Domain;

    public class Datastore {

        public IEnumerable<Account> Accounts { get; set; }
        public Account SelectedAccount { get; set; }
    }
}
