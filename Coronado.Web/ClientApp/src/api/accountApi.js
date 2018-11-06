class AccountApi {
  static async getAllAccounts() {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  static async getAccountTypes() {
    const response = await fetch("/api/AccountTypes");
    return response.json();
  }

  static async getTransactions(accountId) {
    const response = await fetch('api/Transactions/?accountId=' + accountId);
    return response.json();
  }

  static async updateTransaction(transaction) {

    const response = await fetch('/api/Transactions/' + transaction.transactionId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    return response.json();
  }

  static async createTransaction(transaction, transactionType) {
    var url = "/api/Transactions";
    if (transactionType === "Transfer") url = "/api/Transfers"
    if (transactionType === "Mortgage") url = "/api/Mortgages"
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    return response.json();
  }

  static async updateAccount(account) {
    const response = await fetch('api/Accounts/' + account.accountId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    return response.json();
  }

  static async createAccount(account) {
    const response = await fetch('/api/Accounts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    return response.json();
  }
}

AccountApi.baseUrl = "/api/Accounts"
export default AccountApi;