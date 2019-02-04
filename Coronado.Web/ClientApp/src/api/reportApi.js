import { authHeader } from './auth-header';
import { logout } from "./authApi";

class ReportApi {
  static async getNetWorthReport() {
    const requestOptions = {
      method: 'GET',
      headers: authHeader()
    }
    const response = await fetch("api/Reports/NetWorth", requestOptions);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return [];
      }
    }
    return response.json();
  }

}

export default ReportApi;