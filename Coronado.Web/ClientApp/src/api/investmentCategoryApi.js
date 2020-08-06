import { authHeader } from './auth-header';
import { logout } from "./authApi";

class InvestmentCategoryApi {
  static async getAllCategories() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/InvestmentCategories", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response;
  }

  static async updateCategories(categories) {
    const response = await fetch('/api/InvestmentCategories', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categories)
    });
    return response;
  }
}


export default InvestmentCategoryApi;