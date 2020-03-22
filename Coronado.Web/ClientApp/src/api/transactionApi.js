import { authHeader } from './auth-header';
import { logout } from "./authApi";

class AccountApi {

  static async getTransactions(accountId) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch('api/Transactions/?accountId=' + accountId, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async getAllTransactions(accountId) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch('api/Transactions/?accountId=' + accountId + "&loadAll=true", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

  static async updateTransaction(transaction) {

    const response = await fetch('/api/Transactions/' + transaction.transactionId, {
      method: 'PUT',
      headers: {
        ...authHeader(),
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
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    return response.json();
  }
}

export default AccountApi;