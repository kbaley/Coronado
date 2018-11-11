  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

class AccountApi {
  static async getAllAccounts() {
    await sleep(3000);
    const response = await fetch(this.baseUrl);
    return response.json();
  }
    
  static async updateAccount(account) {
    const response = await fetch(this.baseUrl + account.accountId, {
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
    const response = await fetch(this.baseUrl, {
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

AccountApi.baseUrl = "/api/Accounts/"
export default AccountApi;