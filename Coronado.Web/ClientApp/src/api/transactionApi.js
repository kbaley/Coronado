class AccountApi {

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
}

export default AccountApi;