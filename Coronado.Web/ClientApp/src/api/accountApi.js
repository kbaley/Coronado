class AccountApi {

  static async getAllAccounts() {
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

  static async uploadQif(accountId, file, fromDate) {
    const data = new FormData();
    data.append('file', file);
    data.append('accountId', accountId);
    data.append('fromDate', fromDate);
    const response = await fetch(this.baseUrl + "PostQif/", {
      method: 'POST',
      body: data
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