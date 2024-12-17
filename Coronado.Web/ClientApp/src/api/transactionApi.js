import { authHeader } from './auth-header';
import { logout } from "./authApi";

class TransactionApi {

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
    return response;
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
    return response;
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
    return response;
  }

  static async createTransaction(transaction) {
    var url = "/api/Transactions";
    if (transaction.transactionType === "MORTGAGE_PAYMENT") url = "/api/Mortgages"
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    return response;
  }

  static async deleteTransaction(transactionId) {
    return await fetch('/api/Transactions/' + transactionId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

export default TransactionApi;
