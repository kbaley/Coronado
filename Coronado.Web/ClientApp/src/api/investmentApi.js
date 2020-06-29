import { authHeader, defaultHeaders } from './auth-header';
import { logout } from "./authApi";

class InvestmentApi {
  static async getAllInvestments() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Investments", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response;
  }

  static async getInvestment(investmentId) {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Investments/" + investmentId, requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return[];
      }
    }
    return response;
  }

  static async getLatestPrices() {
    const requestOptions = {
      method: 'POST',
      headers: authHeader()
    };
    const response = await fetch("api/Investments/UpdateCurrentPrices", requestOptions);
    return response;
  }

  static async purchaseInvestment(investment) {
    const response = await fetch('/api/Investments', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(investment)
    });
    return response;
  }

  static async updateInvestment(investment) {
    const response = await fetch('/api/Investments/' + investment.investmentId, {
      method: 'PUT',
      headers: defaultHeaders(),
      body: JSON.stringify(investment)
    });
    return response;
  }

  static async buySellInvestment(investment) {
    const response = await fetch('/api/Investments/BuySell', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(investment)
    });
    return response;
  }

  static async saveTodaysPrices(investments) {
    const response = await fetch('/api/Investments/SaveTodaysPrices', {
      method: 'POST',
      headers: defaultHeaders(),
      body: JSON.stringify(investments),
    })
    return response;
  }

  static async makeCorrectingEntries() {
    const response = await fetch('/api/Investments/MakeCorrectingEntries', {
      method: 'POST',
      headers: defaultHeaders(),
    });
    if (response.status === 200) return "";
    return response;
  }

  static async deleteInvestment(investmentId) {

    return fetch('/api/Investments/' + investmentId, {
      method: 'DELETE',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }
}

export default InvestmentApi;