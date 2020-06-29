import { authHeader } from './auth-header';
import { logout } from "./authApi";

class CurrencyApi {

  static async getCurrencies() {
    // Support only for CAD for now
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch(this.baseUrl + "?symbol=CAD", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response;
  }
}

CurrencyApi.baseUrl = "/api/currencies"
export default CurrencyApi;