import { authHeader } from './auth-header';
import { logout } from "./authApi";

class VendorApi {

  static async getVendors() {
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
    return response.json();
  }
}

VendorApi.baseUrl = "/api/Vendors"
export default VendorApi;