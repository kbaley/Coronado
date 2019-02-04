import { authHeader } from './auth-header';
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
    return response.json();
  }

  static async createInvestment(investment) {
    const response = await fetch('/api/Investments', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investment)
    });
    return response.json();
  }

  static async updateInvestment(investment) {
    const response = await fetch('/api/Investments/' + investment.investmentId, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investment)
    });
    return response.json();
  }

  static async makeCorrectingEntries() {
    const response = await fetch('/api/Investments/MakeCorrectingEntries', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) return "";
    return response.json();
  }
}

export default InvestmentApi;