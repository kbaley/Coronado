import { authHeader } from './auth-header';
import { logout } from "./authApi";

class AccountApi {

  static async getAllAccounts() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch(this.baseUrl, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response;
  }
    
  static async updateAccount(account) {
    const response = await fetch(this.baseUrl + account.accountId, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    return response;
  }

  static async uploadQif(accountId, file, fromDate, transactions) {
    const data = new FormData();
    data.append('file', file);
    data.append('accountId', accountId);
    data.append('fromDate', fromDate);
    data.append('transactions', transactions);
    const response = await fetch(this.baseUrl + "PostQif/", {
      method: 'POST',
      headers: {
        ...authHeader()
      },
      body: data
    });
    return response;
  }

  static async createAccount(account) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    return response;
  }

  static async deleteAccount(accountId) {

    return await fetch('/api/Accounts/' + accountId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

AccountApi.baseUrl = "/api/Accounts/"
export default AccountApi;