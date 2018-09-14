using System.Collections.Generic;

namespace Coronado.Web.Models
{
    public class AccountListModel
    {
        public IList<AccountModel> Accounts { get; set; }

        public AccountListModel()
        {
            Accounts = new List<AccountModel>();
        }
    }
}